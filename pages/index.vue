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

    <!-- Authentication Card -->
    <div class="card max-w-md w-full">
      <button 
        @click="handleLogin" 
        :disabled="isLoading"
        class="btn-primary w-full text-lg"
      >
        {{ isLoading ? 'Loading...' : 'Sign In' }}
      </button>
      
      <p class="text-sm text-gray-500 text-center mt-4">
        Joining a family call? No login needed - just click the link!
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
// Sign In Page - Host authentication using Auth0
const { login, isLoading, isAuthenticated } = useAuth0();
const router = useRouter();

// Redirect if already authenticated
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    router.push('/collections');
  }
}, { immediate: true });

const handleLogin = () => {
  login();
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
