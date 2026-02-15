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
      
      if (!localParticipant || !localParticipant.audioTrack || !localParticipant.videoTrack) {
        throw new Error('Media tracks not available');
      }

      // Create a media stream with audio and video
      const stream = new MediaStream();
      
      // Add local video track
      if (localParticipant.videoTrack) {
        stream.addTrack(localParticipant.videoTrack);
      }
      
      // Add local audio track  
      if (localParticipant.audioTrack) {
        stream.addTrack(localParticipant.audioTrack);
      }

      // Add remote participants' tracks
      Object.values(participants).forEach(participant => {
        if (!participant.local) {
          if (participant.audioTrack) {
            stream.addTrack(participant.audioTrack);
          }
          if (participant.videoTrack) {
            stream.addTrack(participant.videoTrack);
          }
        }
      });

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
        if (mediaRecorder && isRecording.value) {
          // Set up one-time listener for stop event
          mediaRecorder.addEventListener('stop', () => {
            console.log('Recording stopped, blob size:', recordingBlob.value?.size);
            isRecording.value = false;
            resolve(recordingBlob.value);
          }, { once: true });

          mediaRecorder.stop();
          
          // Cleanup: Stop all tracks in the stream
          if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
          }
        } else {
          resolve(null);
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
