// Composable for recording video/audio during calls using MediaRecorder API
// Shared state across all instances (singleton pattern)
const isRecording = ref(false);
const currentSpeaker = ref('');
const speakerSegments = ref([]);
const recordingStartTime = ref(null);
const recordingBlob = ref(null);
let mediaRecorder = null;
let recordedChunks = [];

export const useRecording = () => {

  // Start MediaRecorder-based local recording
  const startRecording = async (callObject) => {
    try {
      if (!callObject) {
        throw new Error('Call object not available');
      }

      // Get the media stream from Daily
      const participants = callObject.participants();
      const localParticipant = participants.local;
      
      // Log what we have
      console.log('Local participant:', {
        exists: !!localParticipant,
        hasAudio: !!(localParticipant?.tracks?.audio?.persistentTrack || 
                     localParticipant?.tracks?.audio?.track ||
                     localParticipant?.audioTrack),
        hasVideo: !!(localParticipant?.tracks?.video?.persistentTrack || 
                     localParticipant?.tracks?.video?.track ||
                     localParticipant?.videoTrack)
      });
      
      if (!localParticipant) {
        throw new Error('Local participant not available');
      }
      
      // Check for audio or video track availability using Daily.co structure
      const hasAudioTrack = !!(localParticipant.tracks?.audio?.persistentTrack || 
                               localParticipant.tracks?.audio?.track ||
                               localParticipant.audioTrack);
      
      const hasVideoTrack = !!(localParticipant.tracks?.video?.persistentTrack || 
                               localParticipant.tracks?.video?.track ||
                               localParticipant.videoTrack);
      
      if (!hasAudioTrack && !hasVideoTrack) {
        throw new Error('No audio or video tracks available - check camera/microphone permissions');
      }

      // Create a media stream with audio and video
      const stream = new MediaStream();
      
      // Add local video track (Daily uses .tracks.video structure)
      const videoTrack = localParticipant.tracks?.video?.persistentTrack || 
                        localParticipant.tracks?.video?.track ||
                        localParticipant.videoTrack;
      
      if (videoTrack) {
        stream.addTrack(videoTrack);
        console.log('✅ Added local video track');
      } else {
        console.warn('⚠️ No local video track available');
      }
      
      // Add local audio track (Daily uses .tracks.audio structure)
      const audioTrack = localParticipant.tracks?.audio?.persistentTrack || 
                        localParticipant.tracks?.audio?.track ||
                        localParticipant.audioTrack;
      
      if (audioTrack) {
        stream.addTrack(audioTrack);
        console.log('✅ Added local audio track');
      } else {
        console.warn('⚠️ No local audio track available');
      }

      // Add remote participants' tracks
      Object.values(participants).forEach(participant => {
        if (!participant.local) {
          const remoteAudio = participant.tracks?.audio?.persistentTrack || 
                             participant.tracks?.audio?.track ||
                             participant.audioTrack;
          if (remoteAudio) {
            stream.addTrack(remoteAudio);
            console.log('✅ Added remote audio track from:', participant.user_name || 'Guest');
          }
          
          const remoteVideo = participant.tracks?.video?.persistentTrack || 
                             participant.tracks?.video?.track ||
                             participant.videoTrack;
          if (remoteVideo) {
            stream.addTrack(remoteVideo);
            console.log('✅ Added remote video track from:', participant.user_name || 'Guest');
          }
        }
      });
      
      if (stream.getTracks().length === 0) {
        throw new Error('No media tracks could be added to stream');
      }
      
      console.log('📹 Media stream created with', stream.getTracks().length, 'tracks');

      // Create MediaRecorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      
      // Fallback to vp8 if vp9 is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8,opus';
      }
      
      // Fallback to default if neither codec is supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      mediaRecorder = new MediaRecorder(stream, options);
      recordedChunks = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
          console.log('Recording chunk received:', event.data.size, 'bytes');
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped, total chunks:', recordedChunks.length);
        if (recordedChunks.length > 0) {
          recordingBlob.value = new Blob(recordedChunks, { type: 'video/webm' });
          console.log('Recording blob created:', recordingBlob.value.size, 'bytes');
        }
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        isRecording.value = false;
      };

      // Start recording (capture data every 1 second)
      mediaRecorder.start(1000);
      isRecording.value = true;
      recordingStartTime.value = Date.now();
      
      console.log('MediaRecorder started successfully with mimeType:', options.mimeType);
    } catch (error) {
      console.error('Error starting MediaRecorder:', error);
      throw error;
    }
  };

  // Stop MediaRecorder recording
  const stopRecording = () => {
    return new Promise((resolve) => {
      try {
        if (!mediaRecorder) {
          console.warn('MediaRecorder was never initialized');
          resolve(null);
          return;
        }
        
        if (!isRecording.value) {
          console.warn('Recording was not started');
          resolve(recordingBlob.value || null);
          return;
        }
        
        // Set up one-time listener for stop event
        const stopHandler = () => {
          console.log('Recording stopped, blob created:', {
            size: recordingBlob.value?.size,
            type: recordingBlob.value?.type,
            chunksCount: recordedChunks.length
          });
          isRecording.value = false;
          resolve(recordingBlob.value);
        };
        
        mediaRecorder.addEventListener('stop', stopHandler, { once: true });
        
        // Set timeout in case stop event doesn't fire
        const timeout = setTimeout(() => {
          console.error('Recording stop event timeout');
          mediaRecorder.removeEventListener('stop', stopHandler);
          isRecording.value = false;
          resolve(recordingBlob.value);
        }, 5000);
        
        mediaRecorder.stop();
        
        // Cleanup: Stop all tracks in the stream
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped track:', track.kind);
          });
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        resolve(null);
      }
    });
  };

  // Set current speaker
  const setSpeaker = (speakerName) => {
    const now = Date.now();
    const timestamp = recordingStartTime.value 
      ? (now - recordingStartTime.value) / 1000 
      : 0;

    // Save previous speaker segment if exists
    if (currentSpeaker.value) {
      const lastSegment = speakerSegments.value[speakerSegments.value.length - 1];
      if (lastSegment && !lastSegment.endTime) {
        lastSegment.endTime = timestamp;
      }
    }

    // Start new speaker segment
    currentSpeaker.value = speakerName;
    speakerSegments.value.push({
      speaker: speakerName,
      startTime: timestamp,
      endTime: null
    });
  };

  // Get recording blob
  const getRecordingBlob = () => {
    return recordingBlob.value;
  };

  // Download recording to local computer
  const downloadRecording = (filename = 'recording.webm') => {
    if (!recordingBlob.value) {
      console.warn('No recording available to download');
      return false;
    }

    try {
      const url = URL.createObjectURL(recordingBlob.value);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Recording downloaded:', filename);
      return true;
    } catch (error) {
      console.error('Error downloading recording:', error);
      return false;
    }
  };

  // Reset recording state
  const reset = () => {
    recordingBlob.value = null;
    isRecording.value = false;
    currentSpeaker.value = '';
    speakerSegments.value = [];
    recordingStartTime.value = null;
    mediaRecorder = null;
    recordedChunks = [];
  };

  return {
    isRecording,
    currentSpeaker,
    speakerSegments,
    startRecording,
    stopRecording,
    setSpeaker,
    getRecordingBlob,
    downloadRecording,
    reset
  };
};
