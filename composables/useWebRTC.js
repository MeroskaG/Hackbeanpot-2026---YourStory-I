// Composable for Daily.co video calling
import DailyIframe from '@daily-co/daily-js';

// Shared state across all instances (singleton pattern)
let callObject = null;
const localStream = ref(null);
const participants = ref([]);
const isConnected = ref(false);
const isJoining = ref(false);
const error = ref(null);
const isMicEnabled = ref(true);
const isCameraEnabled = ref(true);

export const useWebRTC = () => {

  // Initialize Daily call object
  const initializeCall = (roomUrl) => {
    if (!callObject) {
      callObject = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: true,
        subscribeToTracksAutomatically: true
      });

      // Set up event listeners
      setupEventListeners();
    }
    return callObject;
  };

  // Set up Daily event listeners
  const setupEventListeners = () => {
    if (!callObject) return;

    // Call state events
    callObject.on('joined-meeting', handleJoinedMeeting);
    callObject.on('left-meeting', handleLeftMeeting);
    callObject.on('participant-joined', handleParticipantJoined);
    callObject.on('participant-updated', handleParticipantUpdated);
    callObject.on('participant-left', handleParticipantLeft);
    callObject.on('track-started', handleTrackStarted);
    callObject.on('error', handleError);
  };

  // Handle joined meeting
  const handleJoinedMeeting = (event) => {
    console.log('Joined meeting', event);
    isConnected.value = true;
    isJoining.value = false;
    
    // Update local participant immediately
    updateParticipants();
    
    // Update again after a short delay to catch tracks that load slowly
    setTimeout(() => {
      console.log('Delayed participant update after join');
      updateParticipants();
    }, 1000);
  };

  // Handle left meeting
  const handleLeftMeeting = (event) => {
    console.log('Left meeting', event);
    isConnected.value = false;
    participants.value = [];
  };

  // Handle participant joined
  const handleParticipantJoined = (event) => {
    console.log('Participant joined', event);
    updateParticipants();
  };

  // Handle participant updated
  const handleParticipantUpdated = (event) => {
    console.log('Participant updated', event);
    updateParticipants();
  };

  // Handle participant left
  const handleParticipantLeft = (event) => {
    console.log('Participant left', event);
    updateParticipants();
  };

  // Handle track started (when video/audio track becomes available)
  const handleTrackStarted = (event) => {
    console.log('Track started', event);
    updateParticipants();
    
    // Update again after delay to ensure track is fully ready
    setTimeout(updateParticipants, 500);
  };

  // Handle errors
  const handleError = (event) => {
    console.error('Daily error', event);
    error.value = event.errorMsg || 'An error occurred';
  };

  // Update participants list
  const updateParticipants = () => {
    if (!callObject) return;

    const dailyParticipants = callObject.participants();
    
    // Convert to array for Vue reactivity
    participants.value = Object.entries(dailyParticipants).map(([id, participant]) => {
      // Extract tracks properly from Daily participant object
      // Try multiple ways to access tracks
      let audioTrack = null;
      let videoTrack = null;
      
      if (participant.tracks) {
        audioTrack = participant.tracks.audio?.persistentTrack || 
                     participant.tracks.audio?.track || 
                     participant.tracks.audio?.state === 'playable' && participant.tracks.audio?.track;
        
        videoTrack = participant.tracks.video?.persistentTrack || 
                     participant.tracks.video?.track ||
                     participant.tracks.video?.state === 'playable' && participant.tracks.video?.track;
      }
      
      console.log(`Participant ${participant.user_name || 'Guest'}:`, {
        id,
        isLocal: participant.local,
        hasAudioTrack: !!audioTrack,
        hasVideoTrack: !!videoTrack,
        audioEnabled: participant.audio,
        videoEnabled: participant.video,
        audioState: participant.tracks?.audio?.state,
        videoState: participant.tracks?.video?.state,
        rawTracks: participant.tracks
      });
      
      return {
        id,
        name: participant.user_name || 'Guest',
        isLocal: participant.local,
        audioTrack,
        videoTrack,
        audioEnabled: participant.audio,
        videoEnabled: participant.video
      };
    });
    
    console.log('Updated participants:', participants.value.length);
  };

  // Join a Daily room
  const joinRoom = async (roomUrl, userName = 'Guest') => {
    try {
      isJoining.value = true;
      error.value = null;

      if (!callObject) {
        initializeCall(roomUrl);
      }

      await callObject.join({
        url: roomUrl,
        userName,
        startVideoOff: false,
        startAudioOff: false
      });
      
      // Ensure local camera and mic are on
      await callObject.setLocalAudio(true);
      await callObject.setLocalVideo(true);

      return true;
    } catch (err) {
      error.value = 'Failed to join call';
      console.error('Error joining room:', err);
      isJoining.value = false;
      throw err;
    }
  };

  // Leave the call
  const leaveCall = async () => {
    try {
      if (callObject) {
        await callObject.leave();
        await callObject.destroy();
        callObject = null;
      }
      
      isConnected.value = false;
      participants.value = [];
      localStream.value = null;
    } catch (err) {
      console.error('Error leaving call:', err);
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (callObject) {
      const newState = !isMicEnabled.value;
      callObject.setLocalAudio(newState);
      isMicEnabled.value = newState;
      return newState;
    }
    return false;
  };

  // Toggle camera
  const toggleCamera = () => {
    if (callObject) {
      const newState = !isCameraEnabled.value;
      callObject.setLocalVideo(newState);
      isCameraEnabled.value = newState;
      return newState;
    }
    return false;
  };

  // Get user media for preview (before joining)
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      localStream.value = stream;
      return stream;
    } catch (err) {
      error.value = 'Failed to access camera/microphone';
      console.error('Error accessing media devices:', err);
      throw err;
    }
  };

  // Stop preview tracks (before joining)
  const stopAllTracks = () => {
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop());
      localStream.value = null;
    }
  };

  // Get recording stream for host (local stream only for now)
  const getRecordingStream = () => {
    if (callObject) {
      try {
        // Get local participant's tracks
        const localParticipant = callObject.participants().local;
        const tracks = [];
        
        // Add video track
        if (localParticipant?.tracks?.video?.persistentTrack) {
          tracks.push(localParticipant.tracks.video.persistentTrack);
        } else if (localParticipant?.tracks?.video?.track) {
          tracks.push(localParticipant.tracks.video.track);
        }
        
        // Add audio track
        if (localParticipant?.tracks?.audio?.persistentTrack) {
          tracks.push(localParticipant.tracks.audio.persistentTrack);
        } else if (localParticipant?.tracks?.audio?.track) {
          tracks.push(localParticipant.tracks.audio.track);
        }
        
        if (tracks.length > 0) {
          return new MediaStream(tracks);
        }
      } catch (error) {
        console.error('Error getting recording stream:', error);
      }
    }
    return null;
  };

  // Clean up
  const cleanup = async () => {
    await leaveCall();
    stopAllTracks();
  };

  // Expose Daily call object for advanced usage
  const getCallObject = () => callObject;

  return {
    // State
    localStream,
    participants,
    isConnected,
    isJoining,
    error,
    isMicEnabled,
    isCameraEnabled,
    
    // Methods
    initializeCall,
    joinRoom,
    leaveCall,
    toggleMicrophone,
    toggleCamera,
    getUserMedia,
    stopAllTracks,
    getRecordingStream,
    cleanup,
    getCallObject
  };
};
