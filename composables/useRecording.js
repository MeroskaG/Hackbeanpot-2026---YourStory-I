// Composable for recording video/audio during calls (host only)
// Shared state across all instances (singleton pattern)
const mediaRecorder = ref(null);
const recordedChunks = ref([]);
const isRecording = ref(false);
const currentSpeaker = ref('');
const speakerSegments = ref([]);
const recordingStartTime = ref(null);

export const useRecording = () => {

  // Start recording
  const startRecording = async (stream) => {
    try {
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus'
      };

      // Fallback to vp8 if vp9 is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8,opus';
      }

      mediaRecorder.value = new MediaRecorder(stream, options);
      recordedChunks.value = [];
      
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.value.push(event.data);
        }
      };

      mediaRecorder.value.start(1000); // Collect data every second
      isRecording.value = true;
      recordingStartTime.value = Date.now();
      
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  };

  // Stop recording
  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.onstop = () => {
          const blob = new Blob(recordedChunks.value, {
            type: 'video/webm'
          });
          isRecording.value = false;
          resolve(blob);
        };
        
        mediaRecorder.value.stop();
      } else {
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
    if (recordedChunks.value.length > 0) {
      return new Blob(recordedChunks.value, { type: 'video/webm' });
    }
    return null;
  };

  // Reset recording state
  const reset = () => {
    mediaRecorder.value = null;
    recordedChunks.value = [];
    isRecording.value = false;
    currentSpeaker.value = '';
    speakerSegments.value = [];
    recordingStartTime.value = null;
  };

  return {
    isRecording,
    currentSpeaker,
    speakerSegments,
    startRecording,
    stopRecording,
    setSpeaker,
    getRecordingBlob,
    reset
  };
};
