<template>
  <div 
    v-motion
    :initial="{ scale: 0.9, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1, transition: { duration: 400 } }"
    :hover="{ scale: 1.05, y: -5 }"
    :tap="{ scale: 0.95 }"
    class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 cursor-pointer shadow-xl hover:shadow-2xl transition-all"
    @click="$emit('click')"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Avatar -->
      <div 
        v-motion
        :initial="{ scale: 0 }"
        :enter="{ scale: 1, transition: { type: 'spring', stiffness: 150, delay: 100 } }"
        class="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg"
      >
        {{ getInitials(member.name) }}
      </div>

      <!-- Name -->
      <h3 class="text-xl font-semibold text-white mb-2">
        {{ member.name }}
      </h3>

      <!-- Stories Count -->
      <p class="text-white/80 mb-4 flex items-center gap-2">
        <Icon name="lucide:book-open" size="16" />
        {{ member.storiesCount }} {{ member.storiesCount === 1 ? 'story' : 'stories' }}
      </p>

      <!-- View Button -->
      <button class="bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/40 text-white px-6 py-2 rounded-full font-semibold transition-all w-full flex items-center justify-center gap-2">
        <Icon name="lucide:eye" size="16" />
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
