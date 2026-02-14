// Composable for recording video/audio during calls using Daily.co's local recording
// Shared state across all instances (singleton pattern)
const isRecording = ref(false);
const currentSpeaker = ref('');
const speakerSegments = ref([]);
const recordingStartTime = ref(null);
const recordingBlob = ref(null);
const recordingId = ref(null);
let callObjectRef = null;

export const useRecording = () => {

  // Start Daily.co local recording
  const startRecording = async (callObject) => {
    try {
      if (!callObject) {
        throw new Error('Call object not available');
      }

      callObjectRef = callObject;
      
      // Set up recording event listeners
      callObject.on('recording-started', handleRecordingStarted);
      callObject.on('recording-stopped', handleRecordingStopped);
      callObject.on('recording-data', handleRecordingData);
      callObject.on('recording-error', handleRecordingError);

      // Start Daily.co local recording
      await callObject.startRecording({
        mode: 'local',
        layout: {
          preset: 'default'
        }
      });
      
      isRecording.value = true;
      recordingStartTime.value = Date.now();
      
      console.log('Daily.co local recording started');
    } catch (error) {
      console.error('Error starting Daily.co recording:', error);
      throw error;
    }
  };

  // Handle recording started event
  const handleRecordingStarted = (event) => {
    console.log('Recording started event:', event);
    recordingId.value = event.recordingId;
  };

  // Handle recording stopped event
  const handleRecordingStopped = (event) => {
    console.log('Recording stopped event:', event);
    isRecording.value = false;
  };

  // Handle recording data (chunks)
  const handleRecordingData = (event) => {
    console.log('Recording data received:', event);
    // Store the recording blob when available
    if (event.data) {
      recordingBlob.value = event.data;
    }
  };

  // Handle recording errors
  const handleRecordingError = (event) => {
    console.error('Recording error:', event);
    isRecording.value = false;
  };

  // Stop Daily.co recording
  const stopRecording = () => {
    return new Promise(async (resolve) => {
      try {
        if (callObjectRef && isRecording.value) {
          await callObjectRef.stopRecording();
          
          // Wait briefly for recording data to be available
          await new Promise(r => setTimeout(r, 1000));
          
          // Clean up event listeners
          callObjectRef.off('recording-started', handleRecordingStarted);
          callObjectRef.off('recording-stopped', handleRecordingStopped);
          callObjectRef.off('recording-data', handleRecordingData);
          callObjectRef.off('recording-error', handleRecordingError);
          
          resolve(recordingBlob.value);
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

  // Reset recording state
  const reset = () => {
    recordingBlob.value = null;
    recordingId.value = null;
    isRecording.value = false;
    currentSpeaker.value = '';
    speakerSegments.value = [];
    recordingStartTime.value = null;
    callObjectRef = null;
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
