<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Video Grid (takes most of the screen) -->
    <div class="flex-1 p-4">
      <CallVideoGrid :isHost="false" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="bg-gray-800 border-t border-gray-700 p-4">
      <div class="max-w-4xl mx-auto flex items-center justify-center space-x-4">
        <CallMuteButton @toggle="toggleMute" :isMuted="!isMicEnabled" />
        <CallCameraButton @toggle="toggleCamera" :isCameraOff="!isCameraEnabled" />
        <CallLeaveCallButton @leave="handleLeave" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Guest Call View - Minimal interface for family members joining via link
// Uses Daily.co for video calling
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
  isMicEnabled,
  isCameraEnabled
} = useWebRTC();

// Join Daily room on mount
onMounted(async () => {
  try {
    const guestName = sessionStorage.getItem('guestName') || 'Guest';
    await joinRoom(props.roomUrl, guestName);
  } catch (error) {
    console.error('Error joining room:', error);
    alert('Failed to join call');
    emit('leave');
  }
});

// Toggle mute
const toggleMute = () => {
  toggleMicrophone();
};

// Toggle camera
const toggleCamera = () => {
  toggleCameraWebRTC();
};

// Handle leave
const handleLeave = async () => {
  if (confirm('Are you sure you want to leave the call?')) {
    await leaveCall();
    emit('leave');
  }
};

// Cleanup on unmount
onBeforeUnmount(async () => {
  await leaveCall();
});
</script>
