<template>
  <div class="h-screen bg-gray-900">
    <!-- Show different views based on user type -->
    <GuestCallView 
      v-if="!isHost && hasJoined"
      :callId="callId"
      :localStream="localStream"
      @leave="handleLeave"
    />
    
    <HostCallView 
      v-else-if="isHost && hasJoined"
      :callId="callId"
      :localStream="localStream"
      @leave="handleEndCall"
    />
    
    <!-- Pre-Join Screen -->
    <PreJoinScreen 
      v-else
      :isHost="isHost"
      @join="handleJoin"
    />
  </div>
</template>

<script setup>
// Video Call Page - Main call interface
// Different views for guests (simple) vs hosts (full featured)
const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth0();
const { getUserMedia, stopAllTracks } = useWebRTC();

const callId = computed(() => route.params.id);
const isHost = computed(() => isAuthenticated.value);
const hasJoined = ref(false);
const localStream = ref(null);

// Handle join call
const handleJoin = async (displayName) => {
  try {
    // Get user media
    localStream.value = await getUserMedia();
    hasJoined.value = true;
    
    // Store display name if guest
    if (!isHost.value && displayName) {
      sessionStorage.setItem('guestName', displayName);
    }
  } catch (error) {
    console.error('Error joining call:', error);
    alert('Failed to access camera/microphone. Please check permissions.');
  }
};

// Handle leave (guest)
const handleLeave = () => {
  stopAllTracks();
  router.push('/');
};

// Handle end call (host)
const handleEndCall = async () => {
  stopAllTracks();
  router.push('/collections');
};

// Cleanup on unmount
onBeforeUnmount(() => {
  stopAllTracks();
});
</script>
