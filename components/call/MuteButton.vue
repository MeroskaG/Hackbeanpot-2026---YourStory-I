<template>
  <button
    v-motion
    :initial="{ scale: 0.9, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1, transition: { duration: 300, delay: 100 } }"
    :hover="{ scale: 1.1, y: -2 }"
    :tap="{ scale: 0.95 }"
    @click="handleToggle"
    class="p-4 rounded-full transition-all shadow-lg"
    :class="isMuted ? 'bg-red-500/90 hover:bg-red-600/90 backdrop-blur-md border border-red-400/30' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30'"
    :title="isMuted ? 'Unmute' : 'Mute'"
  >
    <Icon :name="isMuted ? 'lucide:mic-off' : 'lucide:mic'" size="24" class="text-white" />
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
