<template>
  <div 
    v-motion
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1, transition: { duration: 300 } }"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div 
      v-motion
      :initial="{ scale: 0.9, y: 20, opacity: 0 }"
      :enter="{ scale: 1, y: 0, opacity: 1, transition: { duration: 400, delay: 100 } }"
      class="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 
          v-motion
          :initial="{ x: -20, opacity: 0 }"
          :enter="{ x: 0, opacity: 1, transition: { duration: 400, delay: 200 } }"
          class="text-3xl font-serif text-gray-900 flex items-center gap-2"
        >
          <Icon name="lucide:party-popper" size="32" class="text-purple-600" />
          Call Created!
        </h2>
        <button 
          v-motion
          :hover="{ scale: 1.1, rotate: 90 }"
          :tap="{ scale: 0.9 }"
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <Icon name="lucide:x" size="20" />
        </button>
      </div>

      <p 
        v-motion
        :initial="{ y: 10, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 300 } }"
        class="text-gray-700 mb-6 flex items-start gap-2"
      >
        <Icon name="lucide:users" size="20" class="text-purple-600 mt-0.5 flex-shrink-0" />
        <span>Share this link with family members to invite them to the call:</span>
      </p>

      <!-- Link Display -->
      <div 
        v-motion
        :initial="{ scale: 0.95, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { duration: 400, delay: 400 } }"
        class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-2xl mb-6 flex items-center space-x-3 shadow-inner"
      >
        <input
          ref="linkInput"
          :value="callLink"
          readonly
          class="flex-1 bg-transparent outline-none text-gray-800 font-medium text-sm"
        />
        <button
          v-motion
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          @click="copyLink"
          class="px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2"
          :class="copied ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'"
        >
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" size="16" />
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>

      <!-- Actions -->
      <div 
        v-motion
        :initial="{ y: 10, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 500 } }"
        class="flex flex-col sm:flex-row gap-3"
      >
        <button
          v-motion
          :hover="{ scale: 1.02, boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)' }"
          :tap="{ scale: 0.98 }"
          @click="joinAsHost"
          class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
        >
          <Icon name="lucide:video" size="20" />
          Join Call Now
        </button>
        <button
          v-motion
          :hover="{ scale: 1.02 }"
          :tap="{ scale: 0.98 }"
          @click="$emit('close')"
          class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Invite Link Modal - Displays shareable call link after creation
const props = defineProps({
  callId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'join-call']);

const linkInput = ref(null);
const copied = ref(false);

const callLink = computed(() => {
  if (typeof window !== 'undefined') {
    // Guest links don't include host parameter
    return `${window.location.origin}/call/${props.callId}`;
  }
  return '';
});

const hostCallLink = computed(() => {
  if (typeof window !== 'undefined') {
    // Host link includes host=true parameter
    return `${window.location.origin}/call/${props.callId}?host=true`;
  }
  return '';
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(callLink.value);
    copied.value = true;
    
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error copying link:', error);
    // Fallback: select text
    if (linkInput.value) {
      linkInput.value.select();
    }
  }
};

const joinAsHost = () => {
  // Navigate directly to the call with host=true
  if (typeof window !== 'undefined') {
    window.location.href = hostCallLink.value;
  }
};
</script>
