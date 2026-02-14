// Auth middleware - Protects routes that require host authentication
// Guests can still access call pages without authentication
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return;
  
  const { isAuthenticated, isLoading } = useAuth0();
  
  // Allow access to call pages (guests can join)
  if (to.path.startsWith('/call/')) {
    return;
  }
  
  // Allow access to callback page (Auth0 redirect)
  if (to.path === '/callback') {
    return;
  }
  
  // Protect other routes - redirect to sign in if not authenticated
  if (!isLoading.value && !isAuthenticated.value) {
    return navigateTo('/');
  }
});
