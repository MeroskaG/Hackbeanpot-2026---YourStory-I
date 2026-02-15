<template>
  <section class="py-24 px-4 relative overflow-hidden">
    <!-- Animated background -->
    <div
      v-motion
      :enter="{
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0],
        transition: {
          duration: 20000,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }"
      class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"
    />

    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="max-w-4xl mx-auto relative z-10"
    >
      <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-16 text-center">
        <div
          v-motion
          :enter="{
            scale: [1, 1.2, 1],
            transition: {
              duration: 2000,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }"
          class="inline-block mb-6"
        >
          <Icon name="mdi:heart" size="64" class="text-rose-400" />
        </div>

        <h2
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
          class="text-4xl md:text-5xl font-serif text-white mb-6"
        >
          Start Preserving Today
        </h2>

        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }"
          class="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Every day is an opportunity to capture a precious memory. 
          Don't let another story slip away. Begin your family's legacy today.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visible="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 400 } }"
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            v-motion
            :hover="{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.2)' }"
            :tap="{ scale: 0.95 }"
            @click="emit('start-story')"
            class="group bg-white text-[#6B8E6F] px-10 py-4 rounded-full text-lg font-medium inline-flex items-center gap-3 shadow-2xl"
          >
            Begin Your Story
            <Icon name="mdi:arrow-right" size="20" class="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            v-motion
            :hover="{ scale: 1.05 }"
            :tap="{ scale: 0.95 }"
            class="bg-white/10 border border-white/30 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all"
          >
            Watch Demo
          </button>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1, transition: { duration: 600, delay: 600 } }"
          class="mt-12 pt-8 border-t border-white/20"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div
              v-for="(item, index) in benefits"
              :key="item.label"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 400, delay: 700 + index * 100 } }"
            >
              <div class="text-2xl font-bold text-white mb-1">{{ item.value }}</div>
              <div class="text-white/60 text-sm">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1, transition: { duration: 600, delay: 800 } }"
        class="mt-12 text-center text-white/50 text-sm"
      >
        <p class="mb-4">
          Trusted by families in over 50 countries worldwide
        </p>
        <p>
          © 2026 Our Family. Preserve your family's heritage, one story at a time.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'start-story': []
}>()

const benefits = [
  { label: 'Free Trial', value: '30 Days' },
  { label: 'Setup Time', value: '< 5 Minutes' },
  { label: 'Support', value: '24/7 Available' },
]
</script>
