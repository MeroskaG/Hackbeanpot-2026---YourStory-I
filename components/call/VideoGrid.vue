<template>
  <div class="grid gap-4" :class="gridClass">
    <!-- Local Video (You) -->
    <VideoTile
      :stream="localStream"
      :name="isHost ? 'You (Host)' : 'You'"
      :isSelf="true"
    />
    
    <!-- Remote Videos (Other Participants) -->
    <!-- Placeholder for MVP - would connect to WebRTC peers in full implementation -->
  </div>
</template>

<script setup>
// Video Grid - Displays all participant videos in grid layout
const props = defineProps({
  localStream: {
    type: Object,
    default: null
  },
  isHost: {
    type: Boolean,
    default: false
  }
});

const participantCount = computed(() => {
  // In full implementation, this would be the actual participant count
  return 1; // Just local for MVP
});

const gridClass = computed(() => {
  const count = participantCount.value;
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count <= 4) return 'grid-cols-2';
  return 'grid-cols-3';
});
</script>
