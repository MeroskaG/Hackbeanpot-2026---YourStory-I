<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Recording Indicator -->
    <RecordingIndicator :isRecording="isRecording" />

    <!-- Video Grid -->
    <div class="flex-1 p-4">
      <VideoGrid :localStream="localStream" :isHost="true" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="bg-gray-800 border-t border-gray-700 p-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Left: Media Controls -->
        <div class="flex items-center space-x-4">
          <MuteButton @toggle="toggleMute" :isMuted="isMuted" />
          <CameraButton @toggle="toggleCamera" :isCameraOff="isCameraOff" />
        </div>

        <!-- Center: Speaker Selector -->
        <div class="flex-1 px-8">
          <SpeakerSelector
            :participants="participants"
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
// Includes speaker selector, recording controls, and invite link
const props = defineProps({
  callId: {
    type: String,
    required: true
  },
  localStream: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['leave']);

const { toggleMicrophone, toggleCamera: toggleCameraWebRTC } = useWebRTC();
const { startRecording, stopRecording, setSpeaker, isRecording, currentSpeaker } = useRecording();
const { createStory, uploadFile, endCall, updateCall } = useFirebase();
const { processStory } = useGemini();

const isMuted = ref(false);
const isCameraOff = ref(false);
const participants = ref([
  sessionStorage.getItem('guestName') || 'Guest'
]);

// Start recording when first participant joins
onMounted(async () => {
  if (props.localStream) {
    try {
      await startRecording(props.localStream);
      await updateCall(props.callId, {
        participants: participants.value.map(name => ({ name, joinedAt: new Date() }))
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }
});

// Toggle mute
const toggleMute = () => {
  const enabled = toggleMicrophone();
  isMuted.value = !enabled;
};

// Toggle camera
const toggleCamera = () => {
  const enabled = toggleCameraWebRTC();
  isCameraOff.value = !enabled;
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
    const recordingBlob = await stopRecording();
    
    if (recordingBlob) {
      // Upload to Firebase Storage
  const timestamp = Date.now();
  const uid = sessionStorage.getItem('uid') || 'anonymous';
  const filename = `recordings/${uid}/${props.callId}/${timestamp}.webm`;
  const videoUrl = await uploadFile(recordingBlob, filename);
      
      // Create story for the current speaker
      if (currentSpeaker.value) {
        const story = await createStory({
          callId: props.callId,
          speakerName: currentSpeaker.value,
          videoUrl,
          duration: Math.floor((Date.now() - timestamp) / 1000)
        });
        
        // Trigger AI processing in background
        processStory({
          storyId: story.storyId,
          audioUrl: videoUrl,
          speakerName: currentSpeaker.value
        }).catch(err => console.error('AI processing failed:', err));
      }
    }
    
    // End call in database
    await endCall(props.callId);
    
    // Navigate back
    emit('leave');
  } catch (error) {
    console.error('Error ending call:', error);
    alert('Error ending call. Please try again.');
  }
};
</script>
