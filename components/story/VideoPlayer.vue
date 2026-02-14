<template>
  <div class="bg-black rounded-lg overflow-hidden">
    <video
      ref="videoPlayer"
      :src="videoUrl"
      controls
      class="w-full max-h-[600px]"
      :title="title"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script setup>
// Video Player - Basic video player for story playback
const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const videoPlayer = ref(null);
</script>
