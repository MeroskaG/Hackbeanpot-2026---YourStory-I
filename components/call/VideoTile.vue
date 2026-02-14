<template>
  <div class="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
    <video
      ref="videoElement"
      autoplay
      playsinline
      :muted="participant.isLocal"
      class="w-full h-full object-cover"
    ></video>

    <!-- Name Label -->
    <div class="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
      <span class="text-white text-sm font-medium">
        {{ participant.name }}{{ participant.isLocal ? ' (You)' : '' }}
      </span>
    </div>

    <!-- Audio/Video Status Indicators -->
    <div class="absolute top-4 right-4 flex space-x-2">
      <div v-if="!participant.audioEnabled" class="bg-red-600 p-2 rounded-full">
        <span class="text-white text-sm">🔇</span>
      </div>
      <div v-if="!participant.videoEnabled" class="bg-red-600 p-2 rounded-full">
        <span class="text-white text-sm">📹</span>
      </div>
    </div>

    <!-- Placeholder when video is off -->
    <div 
      v-if="!participant.videoEnabled" 
      class="absolute inset-0 flex items-center justify-center bg-gray-700"
    >
      <div class="text-center">
        <div class="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <span class="text-3xl text-white">👤</span>
        </div>
        <span class="text-white text-sm">{{ participant.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Video Tile - Single participant video from Daily.co
const props = defineProps({
  participantId: {
    type: String,
    required: true
  },
  participant: {
    type: Object,
    required: true
  },
  isHost: {
    type: Boolean,
    default: false
  }
});

const videoElement = ref(null);

// Update video track when it changes
watch(() => props.participant.videoTrack, (newTrack) => {
  if (videoElement.value && newTrack) {
    const stream = new MediaStream([newTrack]);
    videoElement.value.srcObject = stream;
  }
}, { immediate: true });

onMounted(() => {
  if (videoElement.value && props.participant.videoTrack) {
    const stream = new MediaStream([props.participant.videoTrack]);
    videoElement.value.srcObject = stream;
  }
});
</script>
