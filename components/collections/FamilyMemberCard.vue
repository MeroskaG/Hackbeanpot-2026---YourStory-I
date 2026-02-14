<template>
  <div 
    class="card cursor-pointer hover:shadow-lg transition-shadow"
    @click="$emit('click')"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Avatar -->
      <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
        {{ getInitials(member.name) }}
      </div>

      <!-- Name -->
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ member.name }}
      </h3>

      <!-- Stories Count -->
      <p class="text-gray-600 mb-4">
        {{ member.storiesCount }} {{ member.storiesCount === 1 ? 'story' : 'stories' }}
      </p>

      <!-- View Button -->
      <button class="btn-secondary w-full">
        View Stories
      </button>
    </div>
  </div>
</template>

<script setup>
// Family Member Card - Displays a family member with story count
const props = defineProps({
  member: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
</script>
