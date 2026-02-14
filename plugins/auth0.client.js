// Auth0 plugin for host authentication
import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  const auth0 = createAuth0({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: typeof window !== 'undefined' 
        ? window.location.origin + '/callback'
        : config.public.auth0CallbackUrl
    }
  });

  nuxtApp.vueApp.use(auth0);
});
