# Daily.co Local Recording Setup

## Overview

Your app now uses **Daily.co's local recording API** to record video calls. This is more reliable than browser MediaRecorder and is integrated directly with Daily's infrastructure.

---

## Configuration

### 1. Room Creation with Local Recording

**File**: `server/api/call/create-room.js`

```javascript
await fetch('https://api.daily.co/v1/rooms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    properties: {
      enable_recording: 'local',  // ← Enables Daily.co local recording
      enable_chat: false,
      enable_knocking: false,
      start_video_off: false,
      start_audio_off: false,
      max_participants: 10,
      eject_at_room_exp: true,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 4) // 4 hours
    }
  })
});
```

---

## Implementation

### 2. Recording Composable

**File**: `composables/useRecording.js`

#### Start Recording
```javascript
const startRecording = async (callObject) => {
  // Set up event listeners
  callObject.on('recording-started', handleRecordingStarted);
  callObject.on('recording-stopped', handleRecordingStopped);
  callObject.on('recording-data', handleRecordingData);
  callObject.on('recording-error', handleRecordingError);

  // Start Daily.co local recording
  await callObject.startRecording({
    mode: 'local',
    layout: {
      preset: 'default'
    }
  });
  
  isRecording.value = true;
  recordingStartTime.value = Date.now();
};
```

#### Stop Recording
```javascript
const stopRecording = () => {
  return new Promise(async (resolve) => {
    if (callObjectRef && isRecording.value) {
      await callObjectRef.stopRecording();
      
      // Wait for recording data
      await new Promise(r => setTimeout(r, 1000));
      
      // Clean up event listeners
      callObjectRef.off('recording-started', handleRecordingStarted);
      callObjectRef.off('recording-stopped', handleRecordingStopped);
      callObjectRef.off('recording-data', handleRecordingData);
      callObjectRef.off('recording-error', handleRecordingError);
      
      resolve(recordingBlob.value);
    } else {
      resolve(null);
    }
  });
};
```

#### Recording Events
```javascript
// When recording starts
const handleRecordingStarted = (event) => {
  console.log('Recording started:', event.recordingId);
  recordingId.value = event.recordingId;
};

// When recording stops
const handleRecordingStopped = (event) => {
  console.log('Recording stopped');
  isRecording.value = false;
};

// When recording data is available
const handleRecordingData = (event) => {
  if (event.data) {
    recordingBlob.value = event.data;
  }
};

// When recording error occurs
const handleRecordingError = (event) => {
  console.error('Recording error:', event);
  isRecording.value = false;
};
```

---

### 3. Host Call View

**File**: `components/call/HostCallView.vue`

#### Start Recording in Call
```javascript
onMounted(async () => {
  // Join Daily room
  await joinRoom(props.roomUrl, 'Host');
  
  // Start Daily.co local recording
  await startLocalRecording();
});

const startLocalRecording = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for connection
  
  const callObject = getCallObject();
  if (callObject) {
    await startRecording(callObject);  // ← Pass callObject, not stream
    console.log('Daily.co local recording started');
  }
};
```

#### End Call with Recording Upload
```javascript
const handleEndCall = async () => {
  // Stop Daily.co recording
  const recordingBlob = await stopLocalRecording();
  
  if (!recordingBlob) {
    alert('No recording available');
    return;
  }
  
  // Upload to Firebase Storage
  const timestamp = Date.now();
  const filename = `recordings/${props.callId}_${timestamp}.webm`;
  const videoUrl = await uploadFile(recordingBlob, filename);
  
  console.log('Recording uploaded:', videoUrl);
  
  // Create story with video URL
  const storyData = {
    callId: props.callId,
    videoUrl,  // ← Firebase Storage URL
    speakerName: currentSpeaker.value,
    speakerSegments: speakerSegments.value,
    createdAt: new Date()
  };
  
  await createStory(storyData);
  
  // Process with AI (includes videoUrl for ElevenLabs)
  await processStory({
    storyId,
    videoUrl,
    speakerName: storyData.speakerName
  });
};
```

---

## Benefits of Daily.co Local Recording

### ✅ Advantages over MediaRecorder

1. **Better Compatibility** - Works consistently across browsers
2. **Integrated Layout** - Can record all participants in a grid layout
3. **Quality Control** - Daily handles encoding and quality automatically
4. **Event Handling** - Built-in events for recording lifecycle
5. **Error Recovery** - Better error handling and recovery options

### 🎯 Recording Format

- **Output**: WebM video file
- **Quality**: High-quality with automatic optimization
- **Layout**: Configurable (grid, active speaker, etc.)
- **Audio**: All participants' audio mixed together

---

## Video URL Access

After the recording is uploaded to Firebase Storage, the URL is available at:

### 1. In Story Data (Firestore)
```javascript
{
  storyId: "story_123...",
  videoUrl: "https://firebasestorage.googleapis.com/...",
  speakerName: "Host",
  callId: "call_123...",
  createdAt: Timestamp
}
```

### 2. In AI Processing Endpoint
**File**: `server/api/gemini/process-story.js`
```javascript
const { storyId, speakerName, transcript, videoUrl } = await readBody(event);

// Use videoUrl for ElevenLabs API
await fetch('https://api.elevenlabs.io/v1/dubbing', {
  method: 'POST',
  headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
  body: JSON.stringify({
    source_url: videoUrl,  // ← Daily.co recording URL from Firebase
    target_lang: 'en'
  })
});
```

---

## Testing

### Check Recording Status
```javascript
// In browser console during a call
console.log('Is recording:', isRecording.value);
console.log('Recording ID:', recordingId.value);
```

### Verify Upload
```javascript
// After call ends
console.log('Video URL:', videoUrl);
// Should log: https://firebasestorage.googleapis.com/v0/b/...
```

---

## Environment Variables Needed

```env
# Daily.co API Key (for creating rooms)
DAILY_API_KEY=your_daily_api_key_here

# Firebase config (for storage)
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...

# ElevenLabs API Key (optional, for AI processing)
ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

---

## Troubleshooting

### Recording Not Starting
- Check browser console for errors
- Verify `enable_recording: 'local'` in room properties
- Ensure callObject is fully connected before starting recording

### No Recording Blob
- Wait longer after stopping recording (increase timeout from 1000ms)
- Check 'recording-data' event is firing
- Verify browser supports WebM format

### Upload Fails
- Check Firebase Storage rules allow uploads
- Verify Firebase Storage bucket is configured
- Ensure file size is within limits

---

## Next Steps

### Integrate ElevenLabs
See `ELEVENLABS_INTEGRATION_EXAMPLE.js` for code examples on how to send the `videoUrl` to ElevenLabs API for audio processing, dubbing, or transcription.
