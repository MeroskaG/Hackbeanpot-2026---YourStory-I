<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="card max-w-lg w-full">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Call Created!</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <p class="text-gray-600 mb-4">
        Share this link with family members to invite them to the call:
      </p>

      <!-- Link Display -->
      <div class="bg-gray-100 p-3 rounded-lg mb-4 flex items-center space-x-2">
        <input
          ref="linkInput"
          :value="callLink"
          readonly
          class="flex-1 bg-transparent outline-none text-gray-800"
        />
        <button
          @click="copyLink"
          class="btn-secondary py-2"
        >
          {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3">
        <button
          @click="joinAsHost"
          class="btn-primary flex-1"
        >
          Join Call Now
        </button>
        <button
          @click="$emit('close')"
          class="btn-secondary"
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
