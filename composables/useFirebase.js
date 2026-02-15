// Composable for Firebase operations
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirebaseInstances } from '~/utils/firebase-config';

export const useFirebase = () => {
  const { db, storage } = getFirebaseInstances();

  // Create a new call
  const createCall = async (hostId, roomUrl = '') => {
    try {
      const callData = {
        hostId,
        roomUrl,
        participants: [],
        startTime: Timestamp.now(),
        endTime: null,
        status: 'active',
        recordingUrl: ''
      };
      
      const docRef = await addDoc(collection(db, 'calls'), callData);
      return { callId: docRef.id, ...callData };
    } catch (error) {
      console.error('Error creating call:', error);
      throw error;
    }
  };

  // Get call by ID
  const getCall = async (callId) => {
    try {
      const docRef = doc(db, 'calls', callId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { callId: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting call:', error);
      throw error;
    }
  };

  // Update call
  const updateCall = async (callId, data) => {
    try {
      const docRef = doc(db, 'calls', callId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating call:', error);
      throw error;
    }
  };

  // End call
  const endCall = async (callId) => {
    try {
      await updateCall(callId, {
        endTime: Timestamp.now(),
        status: 'ended'
      });
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  };

  // Create a story
  const createStory = async (storyData) => {
    try {
      const docRef = await addDoc(collection(db, 'stories'), {
        ...storyData,
        timestamp: Timestamp.now(),
        aiProcessed: false,
        processingStatus: 'pending'
      });
      return { storyId: docRef.id, ...storyData };
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  };

  // Get story by ID
  const getStory = async (storyId) => {
    try {
      const docRef = doc(db, 'stories', storyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { storyId: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting story:', error);
      throw error;
    }
  };

  // Get all stories
  const getAllStories = async () => {
    try {
      const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        storyId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting stories:', error);
      throw error;
    }
  };

  // Get stories by speaker
  const getStoriesBySpeaker = async (speakerName) => {
    try {
      const q = query(
        collection(db, 'stories'), 
        where('speakerName', '==', speakerName),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        storyId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting stories by speaker:', error);
      throw error;
    }
  };

  // Update story
  const updateStory = async (storyId, data) => {
    try {
      const docRef = doc(db, 'stories', storyId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  };

  // Upload file to storage with progress tracking
  const uploadFile = async (file, path) => {
    try {
      const fileRef = storageRef(storage, path);
      
      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(fileRef, file);
        
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Progress tracking
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress.toFixed(2) + '%');
          },
          (error) => {
            // Error handling
            console.error('Error uploading file:', error);
            reject(error);
          },
          async () => {
            // Upload complete - get download URL
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File uploaded successfully:', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Get family members (unique speakers)
  const getFamilyMembers = async () => {
    try {
      const stories = await getAllStories();
      const speakerMap = new Map();
      
      stories.forEach(story => {
        if (story.speakerName) {
          if (!speakerMap.has(story.speakerName)) {
            speakerMap.set(story.speakerName, {
              name: story.speakerName,
              storiesCount: 0
            });
          }
          speakerMap.get(story.speakerName).storiesCount++;
        }
      });
      
      return Array.from(speakerMap.values());
    } catch (error) {
      console.error('Error getting family members:', error);
      throw error;
    }
  };

  // Subscribe to all stories (real-time)
  const subscribeToAllStories = (callback) => {
    const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const stories = querySnapshot.docs.map(doc => ({
        storyId: doc.id,
        ...doc.data()
      }));
      callback(stories);
    });
  };

  // Subscribe to stories by speaker (real-time)
  const subscribeToStoriesBySpeaker = (speakerName, callback, errorCallback) => {
    console.log('🔵 Firebase: subscribeToStoriesBySpeaker called with:', speakerName);
    console.log('🔵 Firebase: db instance:', db ? 'exists' : 'null');
    
    // Query without orderBy to avoid composite index requirement
    // We'll sort in JavaScript instead
    const q = query(
      collection(db, 'stories'),
      where('speakerName', '==', speakerName)
    );
    console.log('🔵 Firebase: Query created, setting up snapshot listener...');
    
    return onSnapshot(q, 
      (querySnapshot) => {
        console.log('🟢 Firebase: Snapshot received, docs count:', querySnapshot.docs.length);
        const stories = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('🟢 Firebase: Story doc:', doc.id, data);
          return {
            storyId: doc.id,
            ...data
          };
        });
        // Sort by timestamp in JavaScript (newest first)
        stories.sort((a, b) => {
          const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
          const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
          return timeB - timeA;
        });
        console.log('🟢 Firebase: Returning sorted stories:', stories.length);
        callback(stories);
      },
      (error) => {
        console.error('🔴 Firebase: Error in subscribeToStoriesBySpeaker:', error);
        console.error('🔴 Firebase: Error code:', error.code);
        console.error('🔴 Firebase: Error message:', error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };

  // Subscribe to a single story (real-time)
  const subscribeToStory = (storyId, callback) => {
    const docRef = doc(db, 'stories', storyId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ storyId: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    });
  };

  return {
    // Call operations
    createCall,
    getCall,
    updateCall,
    endCall,
    
    // Story operations
    createStory,
    getStory,
    getAllStories,
    getStoriesBySpeaker,
    updateStory,
    
    // Storage operations
    uploadFile,
    
    // Family members
    getFamilyMembers,
    subscribeToAllStories,
    subscribeToStoriesBySpeaker,
    subscribeToStory
  };
};
