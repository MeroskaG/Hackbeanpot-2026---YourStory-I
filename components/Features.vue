<template>
  <section id="features" class="py-24 px-4 relative overflow-hidden">
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
          Everything You Need
        </h2>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Powerful features designed to capture, preserve, and share your family's unique story
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
          :hover="{ y: -10, scale: 1.02 }"
          class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 group cursor-pointer"
        >
          <div
            v-motion
            :hover="{ rotate: 360, scale: 1.1, transition: { duration: 600 } }"
            :class="[feature.color, 'w-14 h-14 rounded-xl flex items-center justify-center mb-4']"
          >
            <Icon :name="feature.icon" size="28" class="text-white" />
          </div>
          
          <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors">
            {{ feature.title }}
          </h3>
          
          <p class="text-white/70 leading-relaxed">
            {{ feature.description }}
          </p>

          <div
            v-motion
            :initial="{ scaleX: 0 }"
            :hover="{ scaleX: 1, transition: { duration: 300 } }"
            class="h-1 bg-gradient-to-r from-white/50 to-white/20 rounded-full mt-4 origin-left"
          />
        </div>
      </div>

      <!-- Feature stats -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
        class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          v-motion
          :hover="{ scale: 1.05 }"
          class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
        >
          <div
            v-motion
            :initial="{ scale: 0 }"
            :visible="{ scale: 1, transition: { duration: 500, delay: 600 + index * 100, type: 'spring' } }"
            class="text-4xl font-bold text-white mb-2"
          >
            {{ stat.number }}
          </div>
          <div class="text-white/60">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'mdi:video',
    title: 'Video Call Recording',
    description: 'Connect face-to-face and record precious conversations with loved ones, no matter where they are.',
    color: 'bg-blue-500',
  },
  {
    icon: 'mdi:sparkles',
    title: 'AI Story Organization',
    description: 'Our AI automatically transcribes and organizes stories, extracting key moments and themes.',
    color: 'bg-purple-500',
  },
  {
    icon: 'mdi:book',
    title: 'Digital Storybooks',
    description: 'Transform recorded memories into beautiful, shareable digital storybooks for generations to come.',
    color: 'bg-amber-500',
  },
  {
    icon: 'mdi:account-multiple',
    title: 'Multi-Generation Sharing',
    description: 'Invite family members of all ages to contribute and access your shared family heritage.',
    color: 'bg-green-500',
  },
  {
    icon: 'mdi:heart',
    title: 'Preserve Heritage',
    description: 'Keep traditions, recipes, and family wisdom alive in a secure, accessible format.',
    color: 'bg-rose-500',
  },
  {
    icon: 'mdi:clock',
    title: 'Timeline View',
    description: 'Explore your family history chronologically and see how stories connect across generations.',
    color: 'bg-indigo-500',
  },
]

const stats = [
  { number: '10,000+', label: 'Stories Preserved' },
  { number: '50+', label: 'Countries Worldwide' },
  { number: '4.9/5', label: 'Average Rating' },
]
</script>
