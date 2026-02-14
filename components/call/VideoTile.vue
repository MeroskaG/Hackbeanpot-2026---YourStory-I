<template>
  <div class="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
    <video
      ref="videoElement"
      autoplay
      playsinline
      :muted="isSelf"
      class="w-full h-full object-cover"
    ></video>

    <!-- Name Label -->
    <div class="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
      <span class="text-white text-sm font-medium">{{ name }}</span>
    </div>

    <!-- Audio Indicator (if muted) -->
    <div v-if="isMuted" class="absolute top-4 right-4 bg-red-600 p-2 rounded-full">
      <span class="text-white text-sm">🔇</span>
    </div>
  </div>
</template>

<script setup>
// Video Tile - Single participant video display
const props = defineProps({
  stream: {
    type: Object,
    default: null
  },
  name: {
    type: String,
    default: 'Unknown'
  },
  isSelf: {
    type: Boolean,
    default: false
  },
  isMuted: {
    type: Boolean,
    default: false
  }
});

const videoElement = ref(null);

// Set stream when component mounts or stream changes
watch(() => props.stream, (newStream) => {
  if (videoElement.value && newStream) {
    videoElement.value.srcObject = newStream;
  }
}, { immediate: true });

onMounted(() => {
  if (videoElement.value && props.stream) {
    videoElement.value.srcObject = props.stream;
  }
});
</script>
