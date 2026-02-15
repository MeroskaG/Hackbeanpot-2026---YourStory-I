<template>
  <section id="how-it-works" class="py-24 px-4 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-sm" />
    
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1, transition: { duration: 800 } }"
      class="max-w-6xl mx-auto relative z-10"
    >
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-20"
      >
        <h2 class="text-4xl md:text-5xl font-serif text-white mb-4">
          How It Works
        </h2>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Four simple steps to preserve your family's legacy
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          v-motion
          :initial="{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }"
          :visible="{ opacity: 1, x: 0, transition: { duration: 600, delay: index * 150 } }"
          class="relative"
        >
          <div
            v-motion
            :hover="{ scale: 1.05 }"
            class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 h-full"
          >
            <!-- Step number -->
            <div class="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-full flex items-center justify-center shadow-xl">
              <span class="text-2xl font-bold text-[#6B8E6F]">{{ step.step }}</span>
            </div>

            <div
              v-motion
              :hover="{ rotate: 360, transition: { duration: 600 } }"
              class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 ml-8"
            >
              <Icon :name="step.icon" size="32" class="text-white" />
            </div>

            <h3 class="text-2xl font-semibold text-white mb-3">
              {{ step.title }}
            </h3>
            
            <p class="text-white/70 leading-relaxed">
              {{ step.description }}
            </p>

            <!-- Connecting line (except for last item) -->
            <div
              v-if="index < steps.length - 1"
              v-motion
              :initial="{ scaleY: 0 }"
              :visible="{ scaleY: 1, transition: { duration: 600, delay: index * 150 + 300 } }"
              class="hidden md:block absolute top-full left-1/2 w-0.5 h-12 bg-gradient-to-b from-white/40 to-transparent origin-top"
            />
          </div>
        </div>
      </div>

      <!-- Call to action -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 800 } }"
        class="mt-16 text-center"
      >
        <button
          v-motion
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          class="bg-white text-[#6B8E6F] px-10 py-4 rounded-full text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
        >
          See It In Action
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    icon: 'mdi:video',
    title: 'Start a Video Call',
    description: 'Schedule a call with family members or join instantly with a unique link.',
    step: '01',
  },
  {
    icon: 'mdi:message-text',
    title: 'Share Your Stories',
    description: 'Talk naturally about memories, traditions, and family history while we record.',
    step: '02',
  },
  {
    icon: 'mdi:magic-wand',
    title: 'AI Magic Happens',
    description: 'Our AI transcribes, organizes, and identifies key moments and themes automatically.',
    step: '03',
  },
  {
    icon: 'mdi:book-open',
    title: 'Create & Share',
    description: 'Review your digital storybook and share it with family members across generations.',
    step: '04',
  },
]
</script>
