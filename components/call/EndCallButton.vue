<template>
  <button
    @click="handleEnd"
    class="p-4 px-6 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
    title="End Call"
  >
    <span class="text-white font-semibold">End Call</span>
  </button>
</template>

<script setup>
// End Call Button - Host ends the call and processes recording
const emit = defineEmits(['end']);

const handleEnd = () => {
  emit('end');
};
</script>
