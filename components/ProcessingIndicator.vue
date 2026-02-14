<template>
  <div v-if="show" class="card bg-blue-50 border border-blue-200">
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <span class="text-3xl animate-spin inline-block">✨</span>
      </div>
      <div>
        <p class="text-blue-900 font-semibold">{{ message }}</p>
        <p class="text-blue-700 text-sm">This may take a few moments...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Processing Indicator - Shows when AI is processing a story
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'AI is processing your story...'
  }
});
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 2s linear infinite;
}
</style>
