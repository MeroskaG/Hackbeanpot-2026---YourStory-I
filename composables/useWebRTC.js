// Composable for Daily.co video calling
import DailyIframe from '@daily-co/daily-js';

export const useWebRTC = () => {
  const callObject = ref(null);
  const localStream = ref(null);
  const participants = ref(new Map());
  const isConnected = ref(false);
  const isJoining = ref(false);
  const error = ref(null);
  const isMicEnabled = ref(true);
  const isCameraEnabled = ref(true);

  // Initialize Daily call object
  const initializeCall = (roomUrl) => {
    if (!callObject.value) {
      callObject.value = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: true
      });

      // Set up event listeners
      setupEventListeners();
    }
    return callObject.value;
  };

  // Set up Daily event listeners
  const setupEventListeners = () => {
    if (!callObject.value) return;

    // Call state events
    callObject.value.on('joined-meeting', handleJoinedMeeting);
    callObject.value.on('left-meeting', handleLeftMeeting);
    callObject.value.on('participant-joined', handleParticipantJoined);
    callObject.value.on('participant-updated', handleParticipantUpdated);
    callObject.value.on('participant-left', handleParticipantLeft);
    callObject.value.on('error', handleError);
  };

  // Handle joined meeting
  const handleJoinedMeeting = (event) => {
    console.log('Joined meeting', event);
    isConnected.value = true;
    isJoining.value = false;
    
    // Update local participant
    updateParticipants();
  };

  // Handle left meeting
  const handleLeftMeeting = (event) => {
    console.log('Left meeting', event);
    isConnected.value = false;
    participants.value.clear();
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

  // Handle errors
  const handleError = (event) => {
    console.error('Daily error', event);
    error.value = event.errorMsg || 'An error occurred';
  };

  // Update participants list
  const updateParticipants = () => {
    if (!callObject.value) return;

    const dailyParticipants = callObject.value.participants();
    const newParticipants = new Map();

    Object.entries(dailyParticipants).forEach(([id, participant]) => {
      newParticipants.set(id, {
        id,
        name: participant.user_name || 'Guest',
        isLocal: participant.local,
        audioTrack: participant.tracks?.audio?.track,
        videoTrack: participant.tracks?.video?.track,
        audioEnabled: !participant.audio,
        videoEnabled: !participant.video
      });
    });

    participants.value = newParticipants;
  };

  // Join a Daily room
  const joinRoom = async (roomUrl, userName = 'Guest') => {
    try {
      isJoining.value = true;
      error.value = null;

      if (!callObject.value) {
        initializeCall(roomUrl);
      }

      await callObject.value.join({
        url: roomUrl,
        userName
      });

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
      if (callObject.value) {
        await callObject.value.leave();
        await callObject.value.destroy();
        callObject.value = null;
      }
      
      isConnected.value = false;
      participants.value.clear();
      localStream.value = null;
    } catch (err) {
      console.error('Error leaving call:', err);
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (callObject.value) {
      const newState = !isMicEnabled.value;
      callObject.value.setLocalAudio(newState);
      isMicEnabled.value = newState;
      return newState;
    }
    return false;
  };

  // Toggle camera
  const toggleCamera = () => {
    if (callObject.value) {
      const newState = !isCameraEnabled.value;
      callObject.value.setLocalVideo(newState);
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

  // Get recording stream for host
  const getRecordingStream = () => {
    if (callObject.value) {
      // Daily provides a method to get the mixed output
      return callObject.value.startRecording();
    }
    return null;
  };

  // Clean up
  const cleanup = async () => {
    await leaveCall();
    stopAllTracks();
  };

  // Expose Daily call object for advanced usage
  const getCallObject = () => callObject.value;

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
