<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          @click="router.push('/collections')"
          class="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to Collections</span>
        </button>
        
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {{ getInitials(memberName) }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ memberName }}</h1>
            <p class="text-gray-600">{{ stories.length }} {{ stories.length === 1 ? 'story' : 'stories' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading stories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Error Loading Stories</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="router.push('/collections')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Collections
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="stories.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📖</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">No stories yet</h2>
        <p class="text-gray-600">No stories recorded for {{ memberName }}</p>
      </div>

      <!-- Stories List -->
      <div v-else class="space-y-4">
        <StoryCard
          v-for="story in stories"
          :key="story.storyId"
          :story="story"
          @click="viewStory(story.storyId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Collections Detail Page - Shows stories for a specific family member
const route = useRoute();
const router = useRouter();
const { subscribeToStoriesBySpeaker } = useFirebase();

const memberName = computed(() => decodeURIComponent(route.params.memberId));
const loading = ref(true);
const stories = ref([]);
const error = ref(null);
let unsubscribeStories = null;

// Load stories on mount
onMounted(() => {
  console.log('🔵 [memberId] page mounted');
  console.log('🔵 Member name:', memberName.value);
  console.log('🔵 Route params:', route.params);
  
  try {
    console.log('🔵 Subscribing to stories for:', memberName.value);
    unsubscribeStories = subscribeToStoriesBySpeaker(
      memberName.value, 
      (results) => {
        console.log('🟢 Stories received:', results.length, results);
        stories.value = results;
        loading.value = false;
        error.value = null;
      },
      (err) => {
        console.error('🔴 Error loading stories:', err);
        error.value = err.message || 'Failed to load stories';
        loading.value = false;
      }
    );
    console.log('🔵 Subscription created');
  } catch (err) {
    console.error('🔴 Error in onMounted:', err);
    error.value = err.message || 'Failed to load stories';
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  if (typeof unsubscribeStories === 'function') {
    unsubscribeStories();
  }
});

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// View story detail
const viewStory = (storyId) => {
  router.push(`/stories/${storyId}`);
};
</script>
