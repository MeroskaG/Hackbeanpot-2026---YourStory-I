// Auth0 plugin for host authentication
import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  console.log('Initializing Auth0 with:', {
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    callbackUrl: config.public.auth0CallbackUrl
  });
  
  const auth0 = createAuth0({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: config.public.auth0CallbackUrl
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  });

  nuxtApp.vueApp.use(auth0);
});
