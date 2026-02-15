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

      <!-- Story Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <button
              @click="selectedStory = null"
              class="bg-teal-600 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-700 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              Back to Library 📚
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
interface Story {
  id: number
  title: string
  storyteller: string
  summary: string
  image: string
  tags: string[]
}
import { ref } from 'vue' 

const selectedStory = ref<Story | null>(null)

const stories: Story[] = [
  {
    id: 1,
    title: 'Summer at the Lake House',
    storyteller: 'Grandpa Joe',
    summary: "Grandpa Joe recounts the summer of '65 when the family built the lakeside cabin by hand. A story of hard work, cool waters, and the biggest bass ever caught.",
    image: 'https://images.unsplash.com/photo-1631535152690-ba1a85229136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0JTIwb2NlYW58ZW58MXx8fHwxNzcxMDk4OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Childhood', 'Summer', 'Family Traditions'],
  },
  {
    id: 2,
    title: 'Meeting Grandmother for the First Time',
    storyteller: 'Uncle James',
    summary: "The heart-warming tale of a chance encounter at a rain-drenched bus stop in London. Joe describes the yellow umbrella that changed his life forever.",
    image: 'https://images.unsplash.com/photo-1768689053098-9a4b8331c6f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBjYW5hbCUyMGhpc3RvcmljfGVufDF8fHx8MTc3MTA5ODk1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Romance', 'London', '1960s'],
  },
  {
    id: 3,
    title: 'The Great Migration',
    storyteller: 'Nana Maria',
    summary: "Nana shares the perilous journey the family took across the mountains. She details the kindness of strangers and the first time she saw the ocean.",
    image: 'https://images.unsplash.com/photo-1683041133891-613b76cbebc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2UlMjBzY2VuaWMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcxMDk4OTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['History', 'Resilience', 'Travel'],
  },
  {
    id: 4,
    title: 'The Secret Garden',
    storyteller: 'Aunt Betty',
    summary: "Aunt Betty recalls her childhood haven - a hidden garden behind the old house where she spent countless hours dreaming and playing.",
    image: 'https://images.unsplash.com/photo-1770871821382-60ea99b0a941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBnYXJkZW4lMjBjaGlsZGhvb2QlMjBob21lfGVufDF8fHx8MTc3MTA5ODk1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Childhood', 'Nature', 'Memories'],
  },
  {
    id: 5,
    title: 'The Wedding That Almost Wasn\'t',
    storyteller: 'Mom & Dad',
    summary: "A hilarious and heartwarming tale of mishaps on their wedding day - from the missing rings to the cake disaster that somehow made everything perfect.",
    image: 'https://images.unsplash.com/photo-1763154431754-4be005ac6ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VsZWJyYXRpb24lMjB2aW50YWdlJTIwcGhvdG98ZW58MXx8fHwxNzcxMDk4OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Wedding', 'Romance', 'Family'],
  },
  {
    id: 6,
    title: 'Grandma\'s Secret Recipe',
    storyteller: 'Grandma Rose',
    summary: "Grandma Rose shares the story behind her famous apple pie recipe, passed down through four generations, and the secret ingredient that makes it special.",
    image: 'https://images.unsplash.com/photo-1758874960533-a0925d4f645c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZG1vdGhlciUyMGtpdGNoZW4lMjBjb29raW5nJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzcxMDk4OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Cooking', 'Tradition', 'Family Recipe'],
  },
]
</script>
