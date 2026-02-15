<template>
  <section class="relative min-h-screen flex items-center justify-center px-4 pt-16">
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
      class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
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
      class="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
    />

    <div class="relative z-10 max-w-4xl mx-auto text-center">
      <div
        v-motion
        :initial="{ scale: 0 }"
        :enter="{ scale: 1, transition: { type: 'spring', duration: 1000, bounce: 0.5 } }"
        class="mb-8 inline-block"
      >
      </div>

      <h1
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
        class="text-5xl md:text-7xl font-serif text-white mb-6"
      >
        Welcome to
        <br />
        <span class="inline-block mt-2">Your Story And I</span>
      </h1>

      <p
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 400 } }"
        class="text-xl md:text-2xl text-white/90 mb-4"
      >
        Preserve memories, connect generations
      </p>

      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 600 } }"
        class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
      >
        <p class="text-white/80 leading-relaxed">
          A sacred space where family stories are treasured and traditions live on. 
          Every memory matters. Every voice counts.
        </p>
      </div>

      <button
        v-motion
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 800 } }"
        :hover="{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }"
        :tap="{ scale: 0.95 }"
        @click="emit('start-story')"
        class="group bg-white text-[#6B8E6F] px-8 py-4 rounded-full text-lg font-medium inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all"
      >
        Begin Your Story
        <Icon name="lucide:sparkles" size="20" />
        <Icon name="lucide:arrow-right" size="20" class="group-hover:translate-x-1 transition-transform" />
      </button>

      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 1000, delay: 1200 } }"
        class="mt-12 text-white/60 text-sm"
      >
        Joining a family call? No login needed!
        <br />
        Just click the unique link sent by your family member.
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      v-motion
      :initial="{ y: 0 }"
      :enter="{
        y: [0, 10, 0],
        transition: {
          duration: 2000,
          repeat: Infinity
        }
      }"
      class="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <div class="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
        <div
          v-motion
          :initial="{ y: 0 }"
          :enter="{
            y: [0, 12, 0],
            transition: {
              duration: 2000,
              repeat: Infinity
            }
          }"
          class="w-1.5 h-1.5 bg-white/60 rounded-full"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck - 
const emit = defineEmits<{
  'start-story': []
}>()
</script>