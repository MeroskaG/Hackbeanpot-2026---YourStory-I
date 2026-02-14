<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Processing login...</p>
    </div>
  </div>
</template>

<script setup>
// Auth0 callback page - handles redirect after authentication
const { isAuthenticated, isLoading } = useAuth0();
const router = useRouter();

watch([isAuthenticated, isLoading], ([authenticated, loading]) => {
  if (!loading && authenticated) {
    router.push('/collections');
  }
}, { immediate: true });
</script>
