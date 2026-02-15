<template>
  <nav
    v-motion
    :initial="{ y: -100 }"
    :enter="{ y: 0, transition: { duration: 600 } }"
    class="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div
          v-motion
          :hover="{ scale: 1.05 }"
          class="flex items-center gap-2 cursor-pointer"
        >
          <!--<img src="/images/hero-image.png" alt="Our Family" class="w-8 h-8" />-->
          <span class="text-white font-serif text-xl">Our Family</span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-8">
          <button
            v-for="item in menuItems"
            :key="item"
            v-motion
            :hover="{ scale: 1.1 }"
            :tap="{ scale: 0.95 }"
            @click="scrollToSection(item.toLowerCase().replace(' ', '-'))"
            class="text-white/90 hover:text-white transition-colors"
          >
            {{ item }}
          </button>
          <button
            v-motion
            :hover="{ scale: 1.05 }"
            :tap="{ scale: 0.95 }"
            class="bg-white text-[#6B8E6F] px-6 py-2 rounded-full font-medium"
          >
            Get Started
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden text-white"
          @click="isOpen = !isOpen"
        >
          <Icon v-if="isOpen" name="mdi:close" size="24" />
          <Icon v-else name="mdi:menu" size="24" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="isOpen"
        v-motion
        :initial="{ opacity: 0, height: 0 }"
        :enter="{ opacity: 1, height: 'auto' }"
        :leave="{ opacity: 0, height: 0 }"
        class="md:hidden pb-4"
      >
        <button
          v-for="item in menuItems"
          :key="item"
          @click="scrollToSection(item.toLowerCase().replace(' ', '-'))"
          class="block w-full text-left text-white/90 hover:text-white py-2 transition-colors"
        >
          {{ item }}
        </button>
        <button class="w-full bg-white text-[#6B8E6F] px-6 py-2 rounded-full font-medium mt-2">
          Get Started
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)


const menuItems = ['Features', 'How It Works', 'Stories', 'Testimonials']

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    isOpen.value = false
  }
}
</script>
