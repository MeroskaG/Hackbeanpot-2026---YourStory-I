<template>
  <div 
    v-motion
    :initial="{ y: 10, opacity: 0 }"
    :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 100 } }"
    class="flex items-center space-x-3"
  >
    <label class="text-white/90 font-semibold text-sm whitespace-nowrap flex items-center gap-2">
      <Icon name="lucide:users" size="18" />
      Who's Talking?
    </label>
    <select
      :value="currentSpeaker"
      @change="handleSelect"
      class="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none text-base font-medium transition-all hover:bg-white/25"
    >
      <option value="" class="bg-gray-800 text-white">Select speaker...</option>
      <option
        v-for="participant in participants"
        :key="participant"
        :value="participant"
        class="bg-gray-800 text-white"
      >
        {{ participant }}
      </option>
    </select>
  </div>
</template>

<script setup>
// Speaker Selector - Host selects who is currently speaking (for tagging recordings)
const props = defineProps({
  participants: {
    type: Array,
    default: () => []
  },
  currentSpeaker: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['select']);

const handleSelect = (event) => {
  emit('select', event.target.value);
};
</script>
