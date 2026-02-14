<template>
  <div v-if="isRecording" class="absolute top-4 left-4 z-10">
    <div class="bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg">
      <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      <span class="text-white font-semibold">Recording</span>
    </div>
  </div>
</template>

<script setup>
// Recording Indicator - Shows when call is being recorded (host view only)
const props = defineProps({
  isRecording: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
