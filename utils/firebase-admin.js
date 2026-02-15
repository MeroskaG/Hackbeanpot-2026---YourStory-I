// utils/firebase-admin.js
// -------------------------------------------------------
// SERVER SIDE Firebase setup (for API routes only)
// This is separate from firebase-config.js which is
// used by the frontend Vue components
//
// Uses firebase-admin package (not firebase package)
// -------------------------------------------------------

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function initFirebaseAdmin() {
  // Only initialize once
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  }
}

// Use this in all your server/api routes
export function getDb() {
  initFirebaseAdmin()
  return getFirestore()
}