// ./src/public/app/firebase.js

let _messagesDb = null;

class Firebase {
  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyCOeHpNVIsEbJu_han0w-LD9r4LDyotL2A',
      authDomain: 'your-story-and-i-1a0b7.firebaseapp.com',
      projectId: 'your-story-and-i-1a0b7',
    });

    // initialize Firestore through Firebase
    _messagesDb = firebase.firestore();

    // disable deprecated features
    _messagesDb.settings({
      timestampsInSnapshots: true
    });
  }

  async addMessage(message) {
    const createdAt = new Date();
    const author = firebase.auth().currentUser.displayName;
    return await _messagesDb.collection('messages').add({
      author,
      createdAt,
      message,
    });
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  async updateProfile(profile) {
    if (!firebase.auth().currentUser) return;
    await firebase.auth().currentUser.updateProfile({
      displayName: profile.name,
      photoURL: profile.picture,
    });
  }

  // Save or update a user record in Firestore under their UID
  async saveUserRecord(profile) {
    if (!firebase.auth().currentUser) return;
    try {
      const uid = firebase.auth().currentUser.uid;
      const userData = {
        displayName: profile.name || firebase.auth().currentUser.displayName || '',
        photoURL: profile.picture || firebase.auth().currentUser.photoURL || '',
        email: profile.email || '',
        lastLogin: new Date()
      };
      return await _messagesDb.collection('users').doc(uid).set(userData, { merge: true });
    } catch (err) {
      console.error('Error saving user record:', err);
      throw err;
    }
  }

  async signOut() {
    await firebase.auth().signOut();
  }

  setAuthStateListener(listener) {
    firebase.auth().onAuthStateChanged(listener);
  }

  setMessagesListener(listener) {
    _messagesDb.collection('messages').orderBy('createdAt', 'desc').limit(10).onSnapshot(listener);
  }

  async setToken(token) {
    await firebase.auth().signInWithCustomToken(token);
  }
}

const firebaseClient = new Firebase();