// Auth middleware - Protects routes that require host authentication
// Guests can still access call pages without authentication
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return;
  
  // Allow access to call pages (guests can join)
  if (to.path.startsWith('/call/')) {
    return;
  }
  
  // Allow access to callback page (Auth0 redirect)
  if (to.path === '/callback') {
    return;
  }
  
  // Allow access to home page
  if (to.path === '/') {
    return;
  }
  
  // For protected routes, check authentication
  try {
    const { isAuthenticated, isLoading } = useAuth0();
    
    // Wait until loading is complete before checking auth
    if (!isLoading.value && !isAuthenticated.value) {
      return navigateTo('/');
    }
  } catch (error) {
    // If Auth0 isn't ready, redirect to home
    console.error('Auth0 not initialized:', error);
    return navigateTo('/');
  }
});
