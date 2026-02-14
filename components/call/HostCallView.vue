<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Recording Indicator -->
    <RecordingIndicator :isRecording="isRecording" />

    <!-- Video Grid -->
    <div class="flex-1 p-4">
      <VideoGrid :isHost="true" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="bg-gray-800 border-t border-gray-700 p-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Left: Media Controls -->
        <div class="flex items-center space-x-4">
          <MuteButton @toggle="toggleMute" :isMuted="!isMicEnabled" />
          <CameraButton @toggle="toggleCamera" :isCameraOff="!isCameraEnabled" />
        </div>

        <!-- Center: Speaker Selector -->
        <div class="flex-1 px-8">
          <SpeakerSelector
            :participants="participantNames"
            :currentSpeaker="currentSpeaker"
            @select="handleSpeakerSelect"
          />
        </div>

        <!-- Right: Call Actions -->
        <div class="flex items-center space-x-4">
          <CopyLinkButton :callId="callId" />
          <EndCallButton @end="handleEndCall" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Host Call View - Full-featured interface for managing recording
// Uses Daily.co for video calling and recording
const props = defineProps({
  callId: {
    type: String,
    required: true
  },
  roomUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['leave']);

const { 
  joinRoom, 
  leaveCall, 
  toggleMicrophone, 
  toggleCamera: toggleCameraWebRTC,
  participants,
  isMicEnabled,
  isCameraEnabled,
  getCallObject
} = useWebRTC();

const { setSpeaker, currentSpeaker } = useRecording();
const { createStory, uploadFile, endCall, updateCall } = useFirebase();
const { processStory } = useGemini();

const isRecording = ref(false);
const recordingId = ref('');

// Get participant names
const participantNames = computed(() => {
  const names = [];
  participants.value.forEach(participant => {
    if (!participant.isLocal) {
      names.push(participant.name);
    }
  });
  return names.length > 0 ? names : ['Guest'];
});

// Join Daily room on mount
onMounted(async () => {
  try {
    const hostName = 'Host';
    await joinRoom(props.roomUrl, hostName);
    
    // Start Daily cloud recording
    await startDailyRecording();
    
    // Update call participants
    await updateCall(props.callId, {
      participants: [{ name: hostName, joinedAt: new Date() }]
    });
  } catch (error) {
    console.error('Error joining room:', error);
    alert('Failed to join call');
    emit('leave');
  }
});

// Start Daily cloud recording
const startDailyRecording = async () => {
  try {
    const callObject = getCallObject();
    if (callObject) {
      const recording = await callObject.startRecording();
      isRecording.value = true;
      recordingId.value = recording.recordingId;
      console.log('Recording started:', recordingId.value);
    }
  } catch (error) {
    console.error('Error starting recording:', error);
  }
};

// Stop Daily cloud recording
const stopDailyRecording = async () => {
  try {
    const callObject = getCallObject();
    if (callObject && recordingId.value) {
      await callObject.stopRecording(recordingId.value);
      isRecording.value = false;
      console.log('Recording stopped');
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
};

// Toggle mute
const toggleMute = () => {
  toggleMicrophone();
};

// Toggle camera
const toggleCamera = () => {
  toggleCameraWebRTC();
};

// Handle speaker selection
const handleSpeakerSelect = (speaker) => {
  setSpeaker(speaker);
};

// Handle end call
const handleEndCall = async () => {
  if (!confirm('Are you sure you want to end the call? This will process all recordings.')) {
    return;
  }

  try {
    // Stop recording
    await stopDailyRecording();
    
    // In a production app, you would:
    // 1. Wait for Daily to process the recording
    // 2. Download the recording URL from Daily
    // 3. Save it to your storage
    // 4. Process with AI
    
    // For MVP, we'll just end the call
    await endCall(props.callId);
    
    // Leave the Daily room
    await leaveCall();
    
    // Navigate back
    emit('leave');
  } catch (error) {
    console.error('Error ending call:', error);
    alert('Error ending call. Please try again.');
  }
};

// Cleanup on unmount
onBeforeUnmount(async () => {
  if (isRecording.value) {
    await stopDailyRecording();
  }
  await leaveCall();
});
</script>
