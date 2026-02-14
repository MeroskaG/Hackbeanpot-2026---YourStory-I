<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <span class="text-2xl">👨‍👩‍👧‍👦</span>
            <span class="text-xl font-bold text-gray-900">Family Stories</span>
          </div>

          <!-- User Profile Dropdown -->
          <div class="relative" v-if="user">
            <button 
              @click="showDropdown = !showDropdown"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {{ getUserInitials(user.name || user.email) }}
              </div>
              <span class="text-sm text-gray-700">{{ user.name || user.email }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="showDropdown" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
            >
              <button 
                @click="handleSignOut"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section / Action Area -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Your Family Stories</h1>
        <button 
          @click="handleStartNewCall"
          class="btn-primary text-lg inline-flex items-center space-x-2"
          :disabled="creatingCall"
        >
          <span>🎥</span>
          <span>{{ creatingCall ? 'Creating Call...' : 'Start New Call' }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading your stories...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="familyMembers.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📖</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">No stories yet</h2>
        <p class="text-gray-600 mb-6">Start your first call to begin collecting family memories</p>
        <button 
          @click="handleStartNewCall"
          class="btn-primary"
        >
          Start New Call
        </button>
      </div>

      <!-- Family Members Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
// Collections Page - Shows family members and their stories (Host only)
definePageMeta({
  middleware: 'auth'
});

const { user, logout } = useAuth0();
const { createCall, getFamilyMembers } = useFirebase();
const router = useRouter();

const showDropdown = ref(false);
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

// Get user initials for avatar
const getUserInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Handle sign out
const handleSignOut = () => {
  logout();
  showDropdown.value = false;
};

// Start new call
const handleStartNewCall = async () => {
  creatingCall.value = true;
  try {
    const userId = user.value?.sub || 'anonymous';
    const call = await createCall(userId);
    currentCallId.value = call.callId;
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
