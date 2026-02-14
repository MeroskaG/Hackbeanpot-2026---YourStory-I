<template>
  <div class="h-screen w-full animated-bg relative flex flex-col items-center justify-center overflow-hidden">
    <!-- Floating background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="float-icon absolute top-1/4 left-1/4 w-32 h-32 rounded-full" style="background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);"></div>
      <div class="float-icon absolute top-1/3 right-1/4 w-48 h-48 rounded-full" style="background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);"></div>
      <div class="float-icon absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full" style="background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);"></div>
      <div class="float-icon absolute bottom-1/3 right-1/3 w-36 h-36 rounded-full" style="background: radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%);"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-6 max-w-md">
      <!-- Icon -->
      <div class="fade-in-sequence fade-in-1 mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl glass-icon">
          📖
        </div>
      </div>

      <!-- Title -->
      <h1 class="fade-in-sequence fade-in-2 font-display text-5xl md:text-6xl font-bold mb-4 text-white" style="text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        Welcome to Our Family
      </h1>

      <!-- Subtitle -->
      <p class="fade-in-sequence fade-in-3 text-lg md:text-xl mb-8 text-white/80">
        Preserve memories, connect generations
      </p>

      <!-- Description -->
      <div class="fade-in-sequence fade-in-4 glass-effect rounded-2xl p-6 mb-8">
        <p class="text-white/90">
          A sacred space where family stories are treasured and traditions live on. Every memory matters. Every voice counts.
        </p>
      </div>

      <!-- CTA Button -->
      <button 
        @click="handleLogin" 
        :disabled="isLoading"
        class="fade-in-sequence fade-in-4 btn-glow w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style="background: linear-gradient(135deg, #ffffff 0%, #f5f0eb 100%); color: #1a1f2e; box-shadow: 0 8px 20px rgba(0,0,0,0.15);"
      >
        <span>{{ isLoading ? 'Loading...' : 'Begin Your Story🫶🤍' }}</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <!-- Profile Selection (Optional for guests) -->
      <div class="fade-in-sequence fade-in-4 mt-12 pt-8 border-t border-white/20">
        <p class="text-sm mb-4 text-white/70">
          Joining a family call? No login needed!
        </p>
        <p class="text-xs text-white/60">
          Just click the invite link shared by your family
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-6 left-0 right-0 text-center">
      <p class="text-sm text-white/60">
        A place to treasure our stories
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
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');

.font-display { 
  font-family: 'Crimson Pro', Georgia, serif; 
}

.animated-bg {
  background: linear-gradient(-45deg, #e8b4a6, #7c9a6e, #9db4c0, #d4a574);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.float-icon {
  animation: float 6s ease-in-out infinite;
}

.float-icon:nth-child(2) { animation-delay: 0.5s; }
.float-icon:nth-child(3) { animation-delay: 1s; }
.float-icon:nth-child(4) { animation-delay: 1.5s; }

@keyframes fadeInUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-sequence {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.fade-in-1 { animation-delay: 0.2s; }
.fade-in-2 { animation-delay: 0.4s; }
.fade-in-3 { animation-delay: 0.6s; }
.fade-in-4 { animation-delay: 0.8s; }

.glass-effect {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.glass-icon {
  background: linear-gradient(135deg, rgba(232,180,166,0.3) 0%, rgba(124,154,110,0.3) 100%);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
}

.btn-glow {
  position: relative;
  overflow: hidden;
}

.btn-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.5s ease;
}

.btn-glow:hover::before {
  left: 100%;
}

.btn-glow:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}
</style>