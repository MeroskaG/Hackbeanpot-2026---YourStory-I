// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    solanaNetwork: process.env.SOLANA_NETWORK || 'devnet',
    solanaRpcUrl: process.env.SOLANA_RPC_URL,
    solanaWalletSecretKey: process.env.SOLANA_WALLET_SECRET_KEY,
    
    // Public keys (client-side accessible)
    public: {
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      auth0CallbackUrl: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Family Stories - Preserve Your Heritage',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Record video calls with family. AI organizes stories by person. Never lose precious memories.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS configuration
  css: [
    '~/assets/css/main.css'
  ],

  // Disable SSR for WebRTC compatibility
  ssr: false
})
