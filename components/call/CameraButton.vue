<template>
  <button
    @click="handleToggle"
    class="p-4 rounded-full transition-colors"
    :class="isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'"
    :title="isCameraOff ? 'Turn on camera' : 'Turn off camera'"
  >
    <span class="text-2xl text-white">{{ isCameraOff ? '📹' : '📷' }}</span>
  </button>
</template>

<script setup>
// Camera Button - Toggle camera on/off
const props = defineProps({
  isCameraOff: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const handleToggle = () => {
  emit('toggle');
};
</script>
