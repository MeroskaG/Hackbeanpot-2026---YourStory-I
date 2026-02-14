<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <div class="mb-4">
        <span class="text-6xl">👨‍👩‍👧‍👦</span>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Family Stories</h1>
      <p class="text-lg text-gray-600">Preserve your family's heritage, one story at a time</p>
    </div>

    <!-- Action Card -->
    <div class="card max-w-md w-full">
      <button 
        @click="goToCollections" 
        class="btn-primary w-full text-lg"
      >
        Get Started
      </button>
      
      <p class="text-sm text-gray-500 text-center mt-4">
        Start recording your family's stories and memories
      </p>
    </div>

    <!-- Footer Section -->
    <div class="text-center mt-8 max-w-2xl">
      <p class="text-gray-600">
        Record video calls with family. AI organizes stories by person. Never lose precious memories.
      </p>
    </div>
  </div>
</template>

<script setup>
// Home Page - Entry point to the application
const router = useRouter();

const goToCollections = () => {
  router.push('/collections');
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
