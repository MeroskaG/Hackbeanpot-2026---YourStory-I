<template>
  <div class="flex items-center space-x-3">
    <label class="text-white font-semibold text-sm whitespace-nowrap">
      Who's Talking?
    </label>
    <select
      :value="currentSpeaker"
      @change="handleSelect"
      class="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-medium"
    >
      <option value="">Select speaker...</option>
      <option
        v-for="participant in participants"
        :key="participant"
        :value="participant"
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
