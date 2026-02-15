<template>
  <section id="testimonials" class="py-24 px-4 relative overflow-hidden">
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
          Testimonials
        </h2>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Real families sharing their experiences preserving memories
        </p>
      </div>

      <!-- Main featured testimonial -->
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-500"
        leave-active-class="transition-all duration-500"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          :key="activeIndex"
          class="max-w-4xl mx-auto mb-12"
        >
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 relative">
            <div
              v-motion
              :enter="{
                rotate: [0, 5, -5, 0],
                transition: {
                  duration: 4000,
                  repeat: Infinity
                }
              }"
              class="absolute -top-6 -left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl"
            >
              <Icon name="mdi:format-quote-open" size="32" class="text-[#6B8E6F]" />
            </div>

            <div class="flex gap-1 mb-6">
              <div
                v-for="i in testimonials[activeIndex].rating"
                :key="i"
                v-motion
                :initial="{ opacity: 0, scale: 0 }"
                :enter="{ opacity: 1, scale: 1, transition: { delay: (i - 1) * 100 } }"
              >
                <Icon name="mdi:star" size="24" class="text-amber-400" />
              </div>
            </div>

            <p class="text-white text-xl md:text-2xl leading-relaxed mb-8 italic">
              "{{ testimonials[activeIndex].quote }}"
            </p>

            <div class="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div class="text-white font-semibold text-lg">
                  {{ testimonials[activeIndex].name }}
                </div>
                <div class="text-white/60">
                  {{ testimonials[activeIndex].relation }} • Age {{ testimonials[activeIndex].age }}
                </div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span class="text-white font-medium">
                  {{ testimonials[activeIndex].storyCount }} stories preserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Testimonial selector -->
      <div class="flex justify-center gap-3 flex-wrap">
        <button
          v-for="(testimonial, index) in testimonials"
          :key="index"
          v-motion
          :hover="{ scale: 1.05 }"
          :tap="{ scale: 0.95 }"
          @click="activeIndex = index"
          :class="[
            'px-6 py-3 rounded-full font-medium transition-all',
            activeIndex === index
              ? 'bg-white text-[#6B8E6F] shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          ]"
        >
          {{ testimonial.name }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeIndex = ref(0)

const testimonials = [
  {
    name: 'Sarah & Michael Chen',
    relation: 'Parents',
    age: 45,
    rating: 5,
    storyCount: 47,
    quote: 'We\'ve captured stories from three generations now. Our kids love hearing their great-grandma\'s voice and seeing her smile. It\'s priceless.',
  },
  {
    name: 'David Thompson',
    relation: 'Son',
    age: 32,
    rating: 5,
    storyCount: 23,
    quote: 'I interviewed my grandfather before he passed. Now my daughter can know him through his stories. This app preserved his legacy forever.',
  },
  {
    name: 'Emma Rodriguez',
    relation: 'Granddaughter',
    age: 28,
    rating: 5,
    storyCount: 35,
    quote: 'Recording family recipes with Grandma was magical. The AI even organized them by holiday and occasion. Our family traditions will live on!',
  },
  {
    name: 'James & Patricia Williams',
    relation: 'Grandparents',
    age: 72,
    rating: 5,
    storyCount: 61,
    quote: 'Technology used to intimidate us, but this is so simple! We\'ve recorded stories for all our grandchildren. They\'ll have these forever.',
  },
  {
    name: 'Priya Patel',
    relation: 'Daughter',
    age: 35,
    rating: 5,
    storyCount: 42,
    quote: 'Connecting our family across three continents was impossible before. Now we record stories together, no matter where we are in the world.',
  },
]
</script>
