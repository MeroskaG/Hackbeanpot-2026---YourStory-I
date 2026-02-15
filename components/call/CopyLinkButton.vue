<template>
  <button
    v-motion
    :initial="{ scale: 0.9, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1, transition: { duration: 300, delay: 150 } }"
    :hover="{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.2)' }"
    :tap="{ scale: 0.95 }"
    @click="copyLink"
    class="px-6 py-3 rounded-full transition-all shadow-xl inline-flex items-center gap-2"
    :class="copied ? 'bg-green-500/90 backdrop-blur-md border border-green-400/30' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30'"
    :title="copied ? 'Copied!' : 'Copy Invite Link'"
  >
    <Icon :name="copied ? 'lucide:check' : 'lucide:link'" size="20" class="text-white" />
    <span class="text-white font-semibold">
      {{ copied ? 'Copied!' : 'Copy Link' }}
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
