<template>
  <button
    @click="handleMint"
    :disabled="minting"
    class="btn-primary"
  >
    {{ minting ? 'Minting...' : '🪙 Mint as NFT' }}
  </button>
</template>

<script setup>
// Mint NFT Button - Mints story as NFT on Solana (optional feature)
const props = defineProps({
  storyId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['minted']);

const minting = ref(false);

const handleMint = async () => {
  if (!confirm('Mint this story as an NFT? This will create a permanent record on the blockchain.')) {
    return;
  }

  minting.value = true;
  
  try {
    const response = await $fetch('/api/solana/mint-nft', {
      method: 'POST',
      body: {
        storyId: props.storyId,
        title: props.title
      }
    });
    
    emit('minted', response.nftAddress);
    alert('Story minted as NFT successfully!');
  } catch (error) {
    console.error('Error minting NFT:', error);
    alert('Failed to mint NFT. This feature may not be configured yet.');
  } finally {
    minting.value = false;
  }
};
</script>
