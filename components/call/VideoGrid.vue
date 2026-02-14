<template>
  <div class="grid gap-4 h-full" :class="gridClass">
    <!-- Render all participants from Daily.co -->
    <VideoTile
      v-for="[id, participant] in participants"
      :key="id"
      :participantId="id"
      :participant="participant"
      :isHost="isHost"
    />
    
    <!-- Empty state if no participants yet -->
    <div v-if="participants.size === 0" class="flex items-center justify-center text-white text-lg">
      Connecting to call...
    </div>
  </div>
</template>

<script setup>
// Video Grid - Displays all participant videos from Daily.co
const props = defineProps({
  isHost: {
    type: Boolean,
    default: false
  }
});

const { participants } = useWebRTC();

const participantCount = computed(() => {
  return participants.value.size;
});

const gridClass = computed(() => {
  const count = participantCount.value;
  if (count === 0 || count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count <= 4) return 'grid-cols-2 grid-rows-2';
  if (count <= 6) return 'grid-cols-3 grid-rows-2';
  return 'grid-cols-3 grid-rows-3';
});
</script>
