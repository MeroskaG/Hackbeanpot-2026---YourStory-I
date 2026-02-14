<template>
  <div class="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
    <video
      ref="videoElement"
      autoplay
      playsinline
      :muted="participant.isLocal"
      class="w-full h-full object-cover"
    ></video>

    <!-- Name Label -->
    <div class="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
      <span class="text-white text-sm font-medium">
        {{ participant.name }}{{ participant.isLocal ? ' (You)' : '' }}
      </span>
    </div>

    <!-- Audio/Video Status Indicators -->
    <div class="absolute top-4 right-4 flex space-x-2">
      <div v-if="!participant.audioEnabled" class="bg-red-600 p-2 rounded-full">
        <span class="text-white text-sm">🔇</span>
      </div>
      <div v-if="!participant.videoEnabled" class="bg-red-600 p-2 rounded-full">
        <span class="text-white text-sm">📹</span>
      </div>
    </div>

    <!-- Placeholder when video is off -->
    <div 
      v-if="!participant.videoEnabled" 
      class="absolute inset-0 flex items-center justify-center bg-gray-700"
    >
      <div class="text-center">
        <div class="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <span class="text-3xl text-white">👤</span>
        </div>
        <span class="text-white text-sm">{{ participant.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Video Tile - Single participant video from Daily.co
const props = defineProps({
  participantId: {
    type: String,
    required: true
  },
  participant: {
    type: Object,
    required: true
  },
  isHost: {
    type: Boolean,
    default: false
  }
});

const videoElement = ref(null);

// Update video track when it changes
watch(() => props.participant.videoTrack, (newTrack) => {
  if (videoElement.value && newTrack) {
    console.log('Setting video track for', props.participant.name, newTrack);
    const stream = new MediaStream([newTrack]);
    videoElement.value.srcObject = stream;
  } else if (videoElement.value && !newTrack) {
    videoElement.value.srcObject = null;
  }
}, { immediate: true });

// Also watch for audio track
watch(() => props.participant.audioTrack, (newTrack) => {
  if (videoElement.value && newTrack && !props.participant.isLocal) {
    // Add audio track to the stream
    const currentStream = videoElement.value.srcObject;
    if (currentStream) {
      const audioTracks = currentStream.getAudioTracks();
      if (audioTracks.length === 0) {
        currentStream.addTrack(newTrack);
      }
    } else {
      const stream = new MediaStream([newTrack]);
      videoElement.value.srcObject = stream;
    }
  }
}, { immediate: true });

onMounted(() => {
  console.log('VideoTile mounted for', props.participant.name, {
    hasVideo: !!props.participant.videoTrack,
    hasAudio: !!props.participant.audioTrack,
    videoEnabled: props.participant.videoEnabled
  });
  
  if (videoElement.value) {
    const tracks = [];
    if (props.participant.videoTrack) tracks.push(props.participant.videoTrack);
    if (props.participant.audioTrack && !props.participant.isLocal) tracks.push(props.participant.audioTrack);
    
    if (tracks.length > 0) {
      const stream = new MediaStream(tracks);
      videoElement.value.srcObject = stream;
    }
  }
});
</script>
