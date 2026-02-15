<template>
  <button
    v-motion
    :initial="{ scale: 0.9, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1, transition: { duration: 300 } }"
    :hover="{ scale: 1.1, y: -2 }"
    :tap="{ scale: 0.95 }"
    @click="handleToggle"
    class="p-4 rounded-full transition-all shadow-lg"
    :class="isCameraOff ? 'bg-red-500/90 hover:bg-red-600/90 backdrop-blur-md border border-red-400/30' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30'"
    :title="isCameraOff ? 'Turn on camera' : 'Turn off camera'"
  >
    <Icon :name="isCameraOff ? 'lucide:video-off' : 'lucide:video'" size="24" class="text-white" />
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
