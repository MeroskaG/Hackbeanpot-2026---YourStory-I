// Auth0 configuration for host authentication
export const useAuth0Config = () => {
  const config = useRuntimeConfig();
  
  return {
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: config.public.auth0CallbackUrl || 'http://localhost:3000/callback',
    }
  };
};
