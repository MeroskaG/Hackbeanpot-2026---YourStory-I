<template>
  <button
    @click="handleToggle"
    class="p-4 rounded-full transition-colors"
    :class="isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'"
    :title="isMuted ? 'Unmute' : 'Mute'"
  >
    <span class="text-2xl text-white">{{ isMuted ? '🔇' : '🎤' }}</span>
  </button>
</template>

<script setup>
// Mute Button - Toggle microphone on/off
const props = defineProps({
  isMuted: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const handleToggle = () => {
  emit('toggle');
};
</script>
