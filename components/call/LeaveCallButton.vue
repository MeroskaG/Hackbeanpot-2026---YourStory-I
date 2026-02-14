<template>
  <button
    @click="handleLeave"
    class="p-4 px-6 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
    title="Leave Call"
  >
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
