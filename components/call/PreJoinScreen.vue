<template>
  <div class="h-screen flex items-center justify-center bg-gray-900">
    <div class="card max-w-md w-full">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
        {{ isHost ? 'Start Your Call' : 'Join Call' }}
      </h2>

      <!-- Video Preview -->
      <div class="mb-6">
        <div class="bg-gray-800 rounded-lg overflow-hidden aspect-video mb-2">
          <video
            ref="previewVideo"
            autoplay
            muted
            playsinline
            class="w-full h-full object-cover"
          ></video>
        </div>
        <p class="text-sm text-gray-600 text-center">Camera preview</p>
      </div>

      <!-- Guest Name Input -->
      <div v-if="!isHost" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          v-model="guestName"
          type="text"
          placeholder="Enter your name"
          class="input-field"
          @keyup.enter="handleJoin"
        />
      </div>

      <!-- Permissions Status -->
      <div v-if="permissionError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700">{{ permissionError }}</p>
      </div>

      <!-- Join Button -->
      <button
        @click="handleJoin"
        :disabled="loading || (!isHost && !guestName.trim())"
        class="btn-primary w-full"
      >
        {{ loading ? 'Connecting...' : 'Join Call' }}
      </button>

      <p class="text-sm text-gray-500 text-center mt-4">
        Make sure your camera and microphone are enabled
      </p>
    </div>
  </div>
</template>

<script setup>
// Pre-Join Screen - Camera/microphone preview and name input (for guests)
const props = defineProps({
  isHost: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['join']);

const previewVideo = ref(null);
const guestName = ref('');
const loading = ref(false);
const permissionError = ref('');
const previewStream = ref(null);

// Start preview on mount
onMounted(async () => {
  try {
    previewStream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    
    if (previewVideo.value) {
      previewVideo.value.srcObject = previewStream.value;
    }
  } catch (error) {
    console.error('Error accessing media devices:', error);
    permissionError.value = 'Could not access camera/microphone. Please grant permissions and refresh.';
  }
});

// Handle join
const handleJoin = () => {
  if (!props.isHost && !guestName.value.trim()) {
    return;
  }
  
  // Stop preview
  if (previewStream.value) {
    previewStream.value.getTracks().forEach(track => track.stop());
  }
  
  emit('join', props.isHost ? null : guestName.value.trim());
};

// Cleanup on unmount
onBeforeUnmount(() => {
  if (previewStream.value) {
    previewStream.value.getTracks().forEach(track => track.stop());
  }
});
</script>
