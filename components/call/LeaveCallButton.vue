<template>
  <button
    v-motion
    :initial="{ scale: 0.9, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1, transition: { duration: 300, delay: 200 } }"
    :hover="{ scale: 1.05, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4)' }"
    :tap="{ scale: 0.95 }"
    @click="handleLeave"
    class="group px-6 py-3 bg-red-600/90 hover:bg-red-700/90 backdrop-blur-md border border-red-500/30 rounded-full transition-all shadow-xl inline-flex items-center gap-2"
    title="Leave Call"
  >
    <Icon name="lucide:log-out" size="20" class="text-white" />
    <span class="text-white font-semibold">Leave Call</span>
  </button>
</template>

<script setup>
// Leave Call Button - Guest leaves the call
const emit = defineEmits(['leave']);

const handleLeave = () => {
  emit('leave');
};
</script>
