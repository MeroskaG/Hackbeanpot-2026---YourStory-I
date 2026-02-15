<template>
  <div 
    v-if="isRecording" 
    v-motion
    :initial="{ y: -20, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { duration: 500 } }"
    class="absolute top-4 left-4 z-10"
  >
    <div class="bg-red-600/90 backdrop-blur-md border border-red-500/30 px-5 py-3 rounded-full flex items-center space-x-3 shadow-2xl">
      <div 
        v-motion
        :initial="{ scale: 1 }"
        :enter="{
          scale: [1, 1.2, 1],
          transition: {
            duration: 2000,
            repeat: Infinity
          }
        } as any"
        class="w-3 h-3 bg-white rounded-full"
      ></div>
      <span class="text-white font-semibold flex items-center gap-2">
        <Icon name="lucide:circle-dot" size="18" />
        Recording
      </span>
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
