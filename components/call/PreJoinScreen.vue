<template>
  <div class="relative min-h-screen flex items-center justify-center px-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <!-- Animated background elements -->
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.3 }"
      :enter="{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        transition: {
          duration: 8000,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }"
      class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
    />
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.2 }"
      :enter="{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
        transition: {
          duration: 10000,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1000
        }
      }"
      class="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
    />

    <div 
      v-motion
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 600 } }"
      class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
    >
      <h2 
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
        class="text-3xl font-serif text-white mb-8 text-center"
      >
        {{ isHost ? 'Start Your Call' : 'Join Call' }}
      </h2>

      <!-- Video Preview -->
      <div 
        v-motion
        :initial="{ scale: 0.9, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { duration: 600, delay: 300 } }"
        class="mb-6"
      >
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden aspect-video mb-3 border border-white/20 shadow-xl">
          <video
            ref="previewVideo"
            autoplay
            muted
            playsinline
            class="w-full h-full object-cover"
          ></video>
        </div>
        <p class="text-sm text-white/70 text-center flex items-center justify-center gap-2">
          <Icon name="lucide:video" size="16" />
          Camera preview
        </p>
      </div>

      <!-- Guest Name Input -->
      <div 
        v-if="!isHost" 
        v-motion
        :initial="{ x: -20, opacity: 0 }"
        :enter="{ x: 0, opacity: 1, transition: { duration: 600, delay: 400 } }"
        class="mb-6"
      >
        <label class="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
          <Icon name="lucide:user" size="16" />
          Your Name *
        </label>
        <input
          v-model="guestName"
          type="text"
          placeholder="Enter your name"
          class="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          @keyup.enter="handleJoin"
        />
      </div>

      <!-- Permissions Status -->
      <div 
        v-if="permissionError" 
        v-motion
        :initial="{ scale: 0.9, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200 } }"
        class="mb-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl"
      >
        <p class="text-sm text-white flex items-center gap-2">
          <Icon name="lucide:alert-circle" size="16" />
          {{ permissionError }}
        </p>
      </div>

      <!-- Join Button -->
      <button
        v-motion
        :initial="{ y: 20, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 600, delay: 500 } }"
        :hover="{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }"
        :tap="{ scale: 0.98 }"
        @click="handleJoin"
        :disabled="loading || (!isHost && !guestName.trim())"
        class="w-full bg-white text-[#667eea] px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon v-if="!loading" name="lucide:video" size="20" />
        <Icon v-else name="lucide:loader-2" size="20" class="animate-spin" />
        {{ loading ? 'Connecting...' : 'Join Call' }}
      </button>

      <p 
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 800, delay: 700 } }"
        class="text-sm text-white/60 text-center mt-6 flex items-center justify-center gap-2"
      >
        <Icon name="lucide:info" size="14" />
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
