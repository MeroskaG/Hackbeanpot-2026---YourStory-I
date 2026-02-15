<template>
  <div class="relative min-h-screen" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <!-- Animated background elements -->
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.3 }"
      :enter="{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        transition: {
          duration: 8000,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }"
      class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"
    />
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.2 }"
      :enter="{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
        transition: {
          duration: 10000,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1000
        }
      }"
      class="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
    />

    <!-- Top Navigation Bar -->
    <nav class="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div 
            v-motion
            :hover="{ scale: 1.05 }"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <span class="text-white font-serif text-xl">Our Family</span>
          </div>

          <!-- Back to Home -->
          <button 
            v-motion
            :hover="{ scale: 1.05 }"
            :tap="{ scale: 0.95 }"
            @click="goHome"
            class="px-6 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/20"
          >
            Home
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section / Action Area -->
      <div 
        v-motion
        :initial="{ y: 30, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <h1 class="text-5xl md:text-6xl font-serif text-white mb-8">Your Family Stories</h1>
        <button 
          v-motion
          :hover="{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }"
          :tap="{ scale: 0.95 }"
          @click="handleStartNewCall"
          class="bg-white text-[#667eea] px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="creatingCall"
        >
          <Icon v-if="!creatingCall" name="lucide:video" size="24" />
          <Icon v-else name="lucide:loader-2" size="24" class="animate-spin" />
          <span>{{ creatingCall ? 'Creating Call...' : 'Start New Call' }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div 
        v-if="loading" 
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 400 } }"
        class="text-center py-12"
      >
        <Icon name="lucide:loader-2" size="48" class="text-white animate-spin mx-auto mb-4" />
        <p class="text-white/90 text-lg">Loading your stories...</p>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="familyMembers.length === 0" 
        v-motion
        :initial="{ scale: 0.9, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { duration: 600, delay: 200 } }"
        class="text-center py-16"
      >
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-2xl mx-auto shadow-2xl">
          <div 
            v-motion
            :initial="{ scale: 0 }"
            :enter="{ scale: 1, transition: { type: 'spring', stiffness: 150, delay: 400 } }"
            class="inline-block bg-white/20 backdrop-blur-sm rounded-full p-8 mb-6"
          >
            <Icon name="lucide:book-open" size="64" class="text-white" />
          </div>
          <h2 class="text-3xl font-serif text-white mb-4">No stories yet</h2>
          <p class="text-white/80 text-lg mb-8">Start your first call to begin collecting family memories</p>
          <button 
            v-motion
            :hover="{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }"
            :tap="{ scale: 0.95 }"
            @click="handleStartNewCall"
            class="bg-white text-[#667eea] px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all"
          >
            <Icon name="lucide:video" size="20" />
            Start New Call
          </button>
        </div>
      </div>

      <!-- Family Members Grid -->
      <div 
        v-else 
        v-motion
        :initial="{ y: 30, opacity: 0 }"
        :enter="{ y: 0, opacity: 1, transition: { duration: 600, delay: 200 } }"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <FamilyMemberCard
          v-for="member in familyMembers"
          :key="member.name"
          :member="member"
          @click="viewMemberStories(member.name)"
        />
      </div>
    </div>

    <!-- Invite Link Modal -->
    <InviteLinkModal 
      v-if="showInviteModal"
      :callId="currentCallId"
      @close="showInviteModal = false"
      @join-call="joinCall"
    />
  </div>
</template>

<script setup>
// Collections Page - Shows family members and their stories
const { createCall, getFamilyMembers } = useFirebase();
const router = useRouter();

const loading = ref(true);
const creatingCall = ref(false);
const familyMembers = ref([]);
const showInviteModal = ref(false);
const currentCallId = ref('');

// Load family members on mount
onMounted(async () => {
  try {
    familyMembers.value = await getFamilyMembers();
  } catch (error) {
    console.error('Error loading family members:', error);
  } finally {
    loading.value = false;
  }
});

// Go back to home
const goHome = () => {
  router.push('/');
};

// Start new call
const handleStartNewCall = async () => {
  creatingCall.value = true;
  try {
    const userId = 'user-' + Date.now(); // Simple user ID generation
    
    // Create Daily room first
    const roomResponse = await $fetch('/api/call/create-room', {
      method: 'POST'
    });
    
    if (!roomResponse.success) {
      throw new Error('Failed to create room');
    }
    
    // Create call with room URL
    const call = await createCall(userId, roomResponse.roomUrl);
    currentCallId.value = call.callId;
    
    // Mark user as host in session storage
    sessionStorage.setItem('isHost', 'true');
    
    showInviteModal.value = true;
  } catch (error) {
    console.error('Error creating call:', error);
    alert('Failed to create call. Please try again.');
  } finally {
    creatingCall.value = false;
  }
};

// Join call as host
const joinCall = () => {
  router.push(`/call/${currentCallId.value}`);
};

// View member stories
const viewMemberStories = (memberName) => {
  router.push(`/collections/${encodeURIComponent(memberName)}`);
};
</script>

<style scoped>
/* Click outside to close dropdown */
</style>
