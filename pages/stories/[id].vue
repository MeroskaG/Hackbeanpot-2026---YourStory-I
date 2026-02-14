<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          @click="router.push('/collections')"
          class="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center space-x-1"
        >
          <span>←</span>
          <span>Back to Collections</span>
        </button>
        
        <div v-if="story">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ story.title || 'Untitled Story' }}
          </h1>
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span>👤 {{ story.speakerName }}</span>
            <span>•</span>
            <span>📅 {{ formatDate(story.timestamp) }}</span>
            <span>•</span>
            <span>⏱️ {{ formatDuration(story.duration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading story...</p>
      </div>

      <!-- Story Content -->
      <div v-else-if="story" class="space-y-6">
        <!-- Video Player -->
        <div class="card">
          <VideoPlayer
            :videoUrl="story.videoUrl || story.audioUrl"
            :title="story.title"
          />
        </div>

        <!-- Processing Indicator -->
        <ProcessingIndicator 
          v-if="!story.aiProcessed && story.processingStatus === 'processing'"
          :show="true"
        />

        <!-- Story Summary -->
        <div v-if="story.summary" class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Story Summary</h2>
          <div class="prose prose-blue max-w-none">
            <p class="text-gray-700 whitespace-pre-wrap">{{ story.summary }}</p>
          </div>
          
          <!-- Tags -->
          <div v-if="story.tags && story.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
            <span 
              v-for="tag in story.tags" 
              :key="tag"
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Transcript Section -->
        <div class="card">
          <button 
            @click="showTranscript = !showTranscript"
            class="w-full flex items-center justify-between text-left"
          >
            <h2 class="text-xl font-semibold text-gray-900">Transcript</h2>
            <span class="text-gray-500">{{ showTranscript ? '▼' : '▶' }}</span>
          </button>
          
          <div v-if="showTranscript" class="mt-4">
            <div v-if="story.transcript" class="prose prose-blue max-w-none">
              <p class="text-gray-700 whitespace-pre-wrap">{{ story.transcript }}</p>
            </div>
            <div v-else class="text-gray-500 italic">
              Transcript not available yet
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div class="flex space-x-4">
            <!-- Mint NFT Button (Optional) -->
            <MintNftButton 
              v-if="story.aiProcessed && !story.nftMinted"
              :storyId="story.storyId"
              :title="story.title"
              @minted="handleNftMinted"
            />
            
            <span 
              v-if="story.nftMinted" 
              class="px-4 py-2 bg-green-100 text-green-700 rounded-lg"
            >
              ✓ Minted as NFT
            </span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Story not found</h2>
        <p class="text-gray-600">This story may have been deleted</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Story Detail Page - View individual story with video, summary, transcript
const route = useRoute();
const router = useRouter();
const { getStory } = useFirebase();

const storyId = computed(() => route.params.id);
const loading = ref(true);
const story = ref(null);
const showTranscript = ref(false);

// Load story on mount
onMounted(async () => {
  try {
    story.value = await getStory(storyId.value);
  } catch (error) {
    console.error('Error loading story:', error);
  } finally {
    loading.value = false;
  }
});

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format duration
const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Handle NFT minted
const handleNftMinted = (nftAddress) => {
  if (story.value) {
    story.value.nftMinted = true;
    story.value.nftAddress = nftAddress;
  }
};
</script>
