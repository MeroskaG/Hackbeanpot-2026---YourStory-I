# Video Recording URL Guide

## Overview
Your app uses **Daily.co's local recording API** to record video calls in the browser and uploads them to **Firebase Storage**. This guide explains where the recording URL is stored and how to access it for the ElevenLabs API.

---

## Recording Flow

### 1. **Daily.co Local Recording** (Browser)
- **File**: `composables/useRecording.js`
- Uses Daily.co's `startRecording({ mode: 'local' })` API
- Recording happens in the browser using Daily's infrastructure
- Creates a `Blob` object with the recording when stopped

**Room Configuration**:
- **File**: `server/api/call/create-room.js`
- Sets `enable_recording: 'local'` when creating Daily.co rooms
- This enables Daily.co's local recording feature

### 2. **Firebase Upload** (After Call Ends)
- **File**: `components/call/HostCallView.vue` (line ~179)
- **Function**: `handleEndCall()`
- Uploads the recording blob to Firebase Storage
- Path format: `recordings/${callId}_${timestamp}.webm`

```javascript
const recordingBlob = await stopLocalRecording();
const filename = `recordings/${props.callId}_${timestamp}.webm`;
const videoUrl = await uploadFile(recordingBlob, filename);
// ☝️ THIS IS YOUR VIDEO URL
```

### 3. **URL Storage in Firestore**
- **File**: `components/call/HostCallView.vue` (line ~183)
- Stored in story document in Firestore

```javascript
const storyData = {
  callId: props.callId,
  videoUrl,  // ← Stored here
  speakerName: currentSpeaker.value || 'Guest',
  speakerSegments: speakerSegments.value,
  duration: recordingBlob.size,
  createdAt: new Date(),
  processed: false
};

const storyId = await createStory(storyData);
```

---

## Where to Access the Video URL

### Option 1: In the AI Processing Endpoint (Recommended for ElevenLabs)
**File**: `server/api/gemini/process-story.js`

Update the endpoint to receive and use `videoUrl`:

```javascript
export default defineEventHandler(async (event) => {
  const { storyId, speakerName, transcript, videoUrl } = await readBody(event)
  
  // Use videoUrl for ElevenLabs API
  if (videoUrl) {
    const elevenlabsResponse = await fetch('https://api.elevenlabs.io/v1/your-endpoint', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        video_url: videoUrl,  // ← Pass the Firebase Storage URL
        // other ElevenLabs parameters
      })
    });
  }
  
  // Continue with Gemini processing...
})
```

### Option 2: Retrieve from Firestore Later
**File**: `composables/useFirebase.js`

```javascript
const story = await getStory(storyId);
const videoUrl = story.videoUrl;  // ← Access the URL from Firestore
```

### Option 3: Create a Dedicated API Endpoint for ElevenLabs
**File**: `server/api/elevenlabs/process-audio.js` (create new)

```javascript
export default defineEventHandler(async (event) => {
  const { storyId, videoUrl } = await readBody(event);
  
  // Call ElevenLabs API with the video URL
  const response = await fetch('https://api.elevenlabs.io/...', {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({ video_url: videoUrl })
  });
  
  return await response.json();
});
```

---

## Video URL Properties

- **Type**: Public Firebase Storage URL
- **Format**: `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/recordings%2F{callId}_{timestamp}.webm?alt=media&token={token}`
- **Access**: Publicly accessible (no authentication required by external services)
- **File Type**: `.webm` (VP9/VP8 codec with Opus audio)
- **Storage Location**: Firebase Storage bucket at path `recordings/`

---

## Integration Points for ElevenLabs

### Where ElevenLabs Gets Called

Currently in **`HostCallView.vue`** (line ~196):

```javascript
// After upload
const videoUrl = await uploadFile(recordingBlob, filename);

// After creating story
await processStory(storyId, videoUrl);  // ← Add videoUrl parameter
```

### Update Process Story Call

In **`components/call/HostCallView.vue`**, update line ~196:

```javascript
try {
  await processStory({
    storyId,
    videoUrl,  // ← Pass the URL here
    speakerName: storyData.speakerName
  });
} catch (aiError) {
  console.warn('AI processing failed, but recording saved:', aiError);
}
```

### Update Gemini Composable

In **`composables/useGemini.js`**, update to handle videoUrl:

```javascript
const processStory = async (storyData) => {
  isProcessing.value = true;
  processingError.value = null;
  
  try {
    const result = await $fetch('/api/gemini/process-story', {
      method: 'POST',
      body: storyData  // Now includes videoUrl
    });
    
    return result;
  } catch (error) {
    processingError.value = error.message;
    console.error('Error processing story:', error);
    throw error;
  } finally {
    isProcessing.value = false;
  }
};
```

---

## Summary

**The video URL is stored in:**
1. ✅ `videoUrl` variable in `HostCallView.vue` after upload (line ~179)
2. ✅ `storyData.videoUrl` when creating the story (line ~183)
3. ✅ Firestore database in the `stories` collection under each story document
4. ✅ Can be passed to `processStory()` for ElevenLabs API (line ~196)

**To use with ElevenLabs:**
- Update `server/api/gemini/process-story.js` to accept `videoUrl` parameter
- Call ElevenLabs API with this URL to process the video/audio
- The URL is publicly accessible, so no special authentication needed for external services
