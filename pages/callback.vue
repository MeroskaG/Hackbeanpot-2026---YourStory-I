<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="!error" class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <div v-else class="text-red-600 mb-4">⚠️</div>
      <p class="text-gray-600">{{ message }}</p>
      <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
// Auth0 callback page - handles redirect after authentication
import { useAuth0 as useAuth0Vue } from '@auth0/auth0-vue';

const auth0 = useAuth0Vue();
const router = useRouter();
const error = ref('');
const message = ref('Processing login...');

// Handle authentication callback
onMounted(async () => {
  console.log('Callback page mounted');
  console.log('Current URL:', window.location.href);
  
  // Check for errors in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlError = urlParams.get('error');
  const errorDesc = urlParams.get('error_description');
  
  if (urlError) {
    console.error('Auth error in URL:', urlError, errorDesc);
    error.value = errorDesc || urlError;
    message.value = 'Authentication failed';
    setTimeout(() => router.push('/'), 3000);
    return;
  }
  
  // If someone navigated directly to /callback without params
  if (!urlParams.has('code') && !urlParams.has('state') && !urlParams.has('error')) {
    console.log('Direct navigation to callback detected');
    message.value = 'Redirecting...';
    setTimeout(() => router.push('/'), 1000);
    return;
  }
  
  // Wait for Auth0 SDK to process the callback (it does this automatically)
  let attempts = 0;
  const maxAttempts = 30; // 15 seconds total
  
  const checkAuth = async () => {
    attempts++;
    console.log(`Check attempt ${attempts}:`, {
      isAuthenticated: auth0.isAuthenticated.value,
      isLoading: auth0.isLoading.value,
      error: auth0.error.value
    });
    
    // Check if SDK encountered an error
    if (auth0.error.value) {
      console.error('Auth0 SDK error:', auth0.error.value);
      error.value = auth0.error.value.message || 'Authentication failed';
      message.value = 'Authentication failed';
      setTimeout(() => router.push('/'), 3000);
      return;
    }
    
    // Once loading is complete, check authentication status
    if (!auth0.isLoading.value) {
      if (auth0.isAuthenticated.value) {
        console.log('Authentication successful!');
        console.log('User:', auth0.user.value);
        message.value = 'Success! Redirecting...';
        setTimeout(() => router.push('/collections'), 500);
      } else {
        console.error('Auth completed but user not authenticated');
        error.value = 'Authentication did not complete successfully';
        message.value = 'Authentication failed';
        setTimeout(() => router.push('/'), 3000);
      }
      return;
    }
    
    // Keep checking if still loading
    if (attempts < maxAttempts) {
      setTimeout(checkAuth, 500);
    } else {
      console.error('Authentication timed out');
      error.value = 'Authentication timed out - please try again';
      message.value = 'Authentication timed out';
      setTimeout(() => router.push('/'), 3000);
    }
  };
  
  // Give the SDK a moment to start processing, then begin checking
  setTimeout(checkAuth, 500);
});
</script>
