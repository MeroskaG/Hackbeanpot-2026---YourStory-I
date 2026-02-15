<template>
  <section id="stories" class="py-24 px-4 relative overflow-hidden">
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1, transition: { duration: 800 } }"
      class="max-w-7xl mx-auto"
    >
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-16"
      >
        <h2 class="text-4xl md:text-5xl font-serif text-white mb-4">
          Your Family's Enchanted Tales ✨
        </h2>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Explore treasured memories and stories from your family
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" size="48" class="text-white animate-spin mx-auto mb-4" />
        <p class="text-white/80 text-lg">Loading your family stories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-400 text-lg">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="stories.length === 0" class="text-center py-12">
        <Icon name="lucide:book-open" size="64" class="text-white/50 mx-auto mb-4" />
        <p class="text-white/80 text-lg">No stories yet. Start recording to create your first story!</p>
      </div>

      <!-- Story Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(story, index) in stories"
          :key="story.id"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
          :hover="{ y: -10, scale: 1.02 }"
          @click="selectedStory = story"
          class="bg-white rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all group relative"
        >
          <!-- Sparkle Icon -->
          <div class="absolute top-4 right-4 z-10">
            <span class="text-2xl">✨</span>
          </div>

          <!-- Image with Play Button -->
          <div class="relative h-48 overflow-hidden">
            <img 
              :src="story.image" 
              :alt="story.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div
                v-motion
                :hover="{ scale: 1.1 }"
                class="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Icon name="mdi:play" size="24" class="text-white ml-1" />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-serif text-teal-700 mb-3">
              {{ story.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {{ story.summary }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, i) in story.tags"
                :key="i"
                class="px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-200"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Story Detail Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedStory"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="selectedStory = null"
      >
        <div
          v-motion
          :initial="{ scale: 0.9, opacity: 0 }"
          :enter="{ scale: 1, opacity: 1, transition: { type: 'spring', duration: 500 } }"
          class="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="selectedStory = null"
            class="absolute top-4 right-4 z-20 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-colors"
          >
            <Icon name="mdi:close" size="20" class="text-gray-800" />
          </button>

          <!-- Image -->
          <div class="relative h-80 overflow-hidden">
            <img
              :src="selectedStory.image"
              :alt="selectedStory.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </div>

          <!-- Content -->
          <div class="p-8 md:p-12">
            <p class="text-pink-500 text-sm mb-2 font-medium">
              A Story by {{ selectedStory.storyteller }} 👨‍🌾
            </p>
            
            <h2 class="text-4xl font-serif text-teal-700 mb-6">
              {{ selectedStory.title }}
            </h2>

            <p class="text-gray-700 text-lg leading-relaxed mb-8">
              {{ selectedStory.summary }}
            </p>

            <div class="flex gap-4">
              <button
                @click="viewFullStory(selectedStory)"
                class="bg-teal-600 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-700 transition-colors shadow-lg inline-flex items-center gap-2"
              >
                <Icon name="mdi:play-circle" size="20" />
                View Full Story
              </button>
              <button
                @click="selectedStory = null"
                class="bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
interface Story {
  id?: string
  storyId?: string
  title: string
  storyteller?: string
  speakerName?: string
  summary?: string
  processedSummary?: string
  image?: string
  videoUrl?: string
  tags?: string[]
}

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedStory = ref<Story | null>(null)
const stories = ref<Story[]>([])
const loading = ref(true)
const error = ref('')

// Fetch real stories from the API
onMounted(async () => {
  try {
    const response = await $fetch('/api/stories/list')
    if (response.success && response.stories) {
      // Map API data to component format
      stories.value = response.stories.map((story: any) => ({
        id: story.id || story.storyId,
        title: story.title || 'Untitled Story',
        storyteller: story.speakerName || 'Unknown',
        summary: story.summary || 'No summary available',
        image: story.audioUrl || story.videoUrl || 'https://images.unsplash.com/photo-1631535152690-ba1a85229136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0JTIwb2NlYW58ZW58MXx8fHwxNzcxMDk4OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: story.tags || []
      }))
      console.log(`Loaded ${stories.value.length} stories from database`)
    }
  } catch (err: any) {
    console.error('Error fetching stories:', err)
    error.value = err.message || 'Failed to load stories'
  } finally {
    loading.value = false
  }
})

// Navigate to full story page
const viewFullStory = (story: Story) => {
  const storyId = story.id || story.storyId
  if (storyId) {
    router.push(`/stories/${storyId}`)
  }
}
</script>
