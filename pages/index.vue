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

// Load external scripts on client in order (keeps SFC to a single <script> block)
if (typeof window !== 'undefined') {
  const scripts = [
    'https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/5.3.0/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/5.3.0/firebase-firestore.js',
    'https://cdn.auth0.com/js/auth0/9.7.3/auth0.min.js',
    '/app/auth0.js',
    '/app/firebase.js',
    '/app/index.js'
  ];

  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    // preserve execution order for legacy globals
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

  onMounted(async () => {
    for (const src of scripts) {
      try {
        // await to preserve order
        // eslint-disable-next-line no-await-in-loop
        await loadScript(src);
      } catch (err) {
        // non-fatal: log and continue
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  });
}
</script>
<style scoped>
/* Additional styles if needed */
</style>
