<template>
  <div class="min-h-screen bg-gradient-to-br from-[#2b362d] via-[#3c4f3e] to-[#2b362d]">
    <Navigation />
    <Hero @start-story="goToCollections" />
    <Features />
    <HowItWorks />
    <Stories />
    <Testimonials />
    <CTA @start-story="goToCollections" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goToCollections = () => {
  router.push('/collections')
}
</script>