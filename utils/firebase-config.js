// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const useFirebaseConfig = () => {
  const config = useRuntimeConfig();
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  };

  return firebaseConfig;
};

let app;
let auth;
let db;
let storage;

export const initializeFirebase = () => {
  if (!app) {
    const config = useFirebaseConfig();
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
  
  return { app, auth, db, storage };
};

export const getFirebaseInstances = () => {
  if (!app) {
    return initializeFirebase();
  }
  return { app, auth, db, storage };
};
