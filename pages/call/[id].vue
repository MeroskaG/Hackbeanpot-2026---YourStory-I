<template>
  <div class="h-screen bg-gray-900">
    <!-- Show different views based on user type -->
    <CallGuestCallView 
      v-if="!isHost && hasJoined"
      :callId="callId"
      :roomUrl="roomUrl"
      @leave="handleLeave"
    />
    
    <CallHostCallView 
      v-else-if="isHost && hasJoined"
      :callId="callId"
      :roomUrl="roomUrl"
      @leave="handleEndCall"
    />
    
    <!-- Pre-Join Screen -->
    <CallPreJoinScreen 
      v-else
      :isHost="isHost"
      @join="handleJoin"
    />
  </div>
</template>

<script setup>
// Video Call Page - Main call interface using Daily.co
// Different views for guests (simple) vs hosts (full featured)
const route = useRoute();
const router = useRouter();
const { getCall } = useFirebase();

const callId = computed(() => route.params.id);
// Check if user is host by looking at URL parameter or session storage
const isHost = computed(() => {
  return route.query.host === 'true' || sessionStorage.getItem('isHost') === 'true';
});
const hasJoined = ref(false);
const roomUrl = ref('');

// Load call data to get room URL
onMounted(async () => {
  try {
    const call = await getCall(callId.value);
    if (call && call.roomUrl) {
      roomUrl.value = call.roomUrl;
    } else {
      console.error('Call not found or no room URL');
      alert('Invalid call link');
      router.push('/');
    }
  } catch (error) {
    console.error('Error loading call:', error);
    alert('Failed to load call');
    router.push('/');
  }
});

// Handle join call
const handleJoin = async (displayName) => {
  try {
    hasJoined.value = true;
    
    // Store display name if guest
    if (!isHost.value && displayName) {
      sessionStorage.setItem('guestName', displayName);
    }
  } catch (error) {
    console.error('Error joining call:', error);
    alert('Failed to join call. Please try again.');
    hasJoined.value = false;
  }
};

// Handle leave (guest)
const handleLeave = () => {
  router.push('/');
};

// Handle end call (host)
const handleEndCall = async () => {
  router.push('/collections');
};
</script>
