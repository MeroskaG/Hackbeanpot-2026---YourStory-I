<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Video Grid (takes most of the screen) -->
    <div class="flex-1 p-4">
      <VideoGrid :localStream="localStream" :isHost="false" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="bg-gray-800 border-t border-gray-700 p-4">
      <div class="max-w-4xl mx-auto flex items-center justify-center space-x-4">
        <MuteButton @toggle="toggleMute" :isMuted="isMuted" />
        <CameraButton @toggle="toggleCamera" :isCameraOff="isCameraOff" />
        <LeaveCallButton @leave="handleLeave" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Guest Call View - Minimal interface for family members joining via link
// Only shows video grid and basic controls (mute, camera, leave)
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
const isMuted = ref(false);
const isCameraOff = ref(false);

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

// Handle leave
const handleLeave = () => {
  if (confirm('Are you sure you want to leave the call?')) {
    emit('leave');
  }
};
</script>
