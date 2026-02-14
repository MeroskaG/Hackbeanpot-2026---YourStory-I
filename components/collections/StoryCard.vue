<template>
  <div 
    class="card cursor-pointer hover:shadow-lg transition-shadow"
    @click="$emit('click')"
  >
    <div class="flex items-start space-x-4">
      <!-- Thumbnail Placeholder -->
      <div class="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <span class="text-4xl">🎥</span>
      </div>

      <!-- Story Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 truncate">
          {{ story.title || 'Untitled Story' }}
        </h3>

        <div class="space-y-1 text-sm text-gray-600">
          <p>📅 {{ formatDate(story.timestamp) }}</p>
          <p>⏱️ {{ formatDuration(story.duration) }}</p>
          <p v-if="story.aiProcessed" class="text-green-600">✓ AI Processed</p>
          <p v-else-if="story.processingStatus === 'processing'" class="text-blue-600">
            ⏳ Processing...
          </p>
        </div>

        <!-- Tags -->
        <div v-if="story.tags && story.tags.length > 0" class="mt-3 flex flex-wrap gap-2">
          <span 
            v-for="tag in story.tags.slice(0, 3)" 
            :key="tag"
            class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- View Button -->
      <button class="btn-secondary self-center">
        View
      </button>
    </div>
  </div>
</template>

<script setup>
// Story Card - Displays a story summary in a list
const props = defineProps({
  story: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>
