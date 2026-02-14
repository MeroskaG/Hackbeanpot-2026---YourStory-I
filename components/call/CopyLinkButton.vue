<template>
  <button
    @click="copyLink"
    class="p-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
    :title="copied ? 'Copied!' : 'Copy Invite Link'"
  >
    <span class="text-white font-semibold">
      {{ copied ? '✓ Copied!' : '🔗 Copy Link' }}
    </span>
  </button>
</template>

<script setup>
// Copy Link Button - Copies call invite link to clipboard
const props = defineProps({
  callId: {
    type: String,
    required: true
  }
});

const copied = ref(false);

const copyLink = async () => {
  const link = `${window.location.origin}/call/${props.callId}`;
  
  try {
    await navigator.clipboard.writeText(link);
    copied.value = true;
    
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error copying link:', error);
    alert('Failed to copy link. Please copy manually: ' + link);
  }
};
</script>
