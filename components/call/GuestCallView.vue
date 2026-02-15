<template>
  <div class="relative h-screen flex flex-col" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <!-- Animated background elements -->
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.2 }"
      :enter="{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
        transition: {
          duration: 8000,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }"
      class="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
    />
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.2 }"
      :enter="{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.3, 0.2],
        transition: {
          duration: 10000,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1000
        }
      }"
      class="absolute bottom-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"
    />
    
    <!-- Video Grid (takes most of the screen) -->
    <div class="relative z-10 flex-1 p-4">
      <CallVideoGrid :isHost="false" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 p-4">
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
