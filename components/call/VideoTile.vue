<template>
  <div 
    v-motion
    :initial="{ scale: 0.95, opacity: 0 }"
    :enter="{ scale: 1, opacity: 1, transition: { duration: 400 } }"
    class="relative bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden aspect-video border border-white/20 shadow-2xl"
  >
    <video
      ref="videoElement"
      autoplay
      playsinline
      :muted="participant.isLocal"
      class="w-full h-full object-cover"
    ></video>

    <!-- Name Label -->
    <div 
      v-motion
      :initial="{ y: 10, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 300, delay: 200 } }"
      class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg"
    >
      <span class="text-white text-sm font-semibold flex items-center gap-2">
        <Icon name="lucide:user" size="14" />
        {{ participant.name }}{{ participant.isLocal ? ' (You)' : '' }}
      </span>
    </div>

    <!-- Audio/Video Status Indicators -->
    <div class="absolute top-4 right-4 flex space-x-2">
      <div 
        v-if="!participant.audioEnabled" 
        v-motion
        :initial="{ scale: 0 }"
        :enter="{ scale: 1, transition: { type: 'spring', stiffness: 200 } }"
        class="bg-red-500/90 backdrop-blur-sm border border-red-400/30 p-2 rounded-full shadow-lg"
      >
        <Icon name="lucide:mic-off" size="16" class="text-white" />
      </div>
      <div 
        v-if="!participant.videoEnabled" 
        v-motion
        :initial="{ scale: 0 }"
        :enter="{ scale: 1, transition: { type: 'spring', stiffness: 200 } }"
        class="bg-red-500/90 backdrop-blur-sm border border-red-400/30 p-2 rounded-full shadow-lg"
      >
        <Icon name="lucide:video-off" size="16" class="text-white" />
      </div>
    </div>

    <!-- Placeholder when video is off -->
    <div 
      v-if="!participant.videoEnabled" 
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600/50 to-blue-600/50 backdrop-blur-sm"
    >
      <div class="text-center">
        <div 
          v-motion
          :initial="{ scale: 0 }"
          :enter="{ scale: 1, transition: { type: 'spring', stiffness: 150, delay: 100 } }"
          class="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl"
        >
          <Icon name="lucide:user" size="40" class="text-white" />
        </div>
        <span class="text-white text-sm font-medium">{{ participant.name }}</span>
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
watch(() => props.participant.videoTrack, (newTrack, oldTrack) => {
  console.log(`Video track changed for ${props.participant.name}:`, {
    hasNew: !!newTrack,
    hasOld: !!oldTrack,
    hasElement: !!videoElement.value,
    trackId: newTrack?.id
  });
  
  if (videoElement.value && newTrack) {
    console.log('Setting video track for', props.participant.name, newTrack);
    const stream = new MediaStream([newTrack]);
    videoElement.value.srcObject = stream;
    
    // Force play (sometimes needed)
    videoElement.value.play().catch(err => {
      console.log('Autoplay prevented for video:', err);
    });
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
    videoEnabled: props.participant.videoEnabled,
    isLocal: props.participant.isLocal
  });
  
  if (videoElement.value) {
    const tracks = [];
    if (props.participant.videoTrack) tracks.push(props.participant.videoTrack);
    if (props.participant.audioTrack && !props.participant.isLocal) tracks.push(props.participant.audioTrack);
    
    if (tracks.length > 0) {
      const stream = new MediaStream(tracks);
      videoElement.value.srcObject = stream;
      console.log('Initial stream set for', props.participant.name, 'with', tracks.length, 'tracks');
      
      // Force play
      videoElement.value.play().catch(err => {
        console.log('Autoplay prevented on mount:', err);
      });
    } else {
      console.log('No tracks available on mount for', props.participant.name);
    }
  }
});
</script>
