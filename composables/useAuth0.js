// Composable for Auth0 authentication (host only)
import { useAuth0 as useAuth0Vue } from '@auth0/auth0-vue';

export const useAuth0 = () => {
  const auth0 = useAuth0Vue();
  
  const login = () => {
    auth0.loginWithRedirect();
  };
  
  const logout = () => {
    auth0.logout({
      logoutParams: {
        returnTo: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000/'
      }
    });
  };
  
  return {
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    user: auth0.user,
    login,
    logout,
    getAccessToken: auth0.getAccessTokenSilently
  };
};
