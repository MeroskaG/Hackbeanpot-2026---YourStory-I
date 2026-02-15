// Example: ElevenLabs API Integration
// This file shows how to use the video URL with ElevenLabs API

// Option 1: Add to server/api/gemini/process-story.js
export default defineEventHandler(async (event) => {
  const { storyId, speakerName, transcript, videoUrl } = await readBody(event);
  
  // Call ElevenLabs API with the video URL
  if (videoUrl) {
    const elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;
    
    if (elevenlabsApiKey) {
      try {
        // Example: ElevenLabs dubbing or speech-to-speech API
        const elevenlabsResponse = await fetch('https://api.elevenlabs.io/v1/dubbing', {
          method: 'POST',
          headers: {
            'xi-api-key': elevenlabsApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source_url: videoUrl,  // ← The Firebase Storage URL
            target_lang: 'en',
            // Add other ElevenLabs parameters as needed
          })
        });
        
        const elevenlabsResult = await elevenlabsResponse.json();
        console.log('ElevenLabs processing started:', elevenlabsResult);
        
        // Store the ElevenLabs dubbing ID or result
        // You might want to save this to Firestore
      } catch (error) {
        console.error('ElevenLabs API error:', error);
        // Continue with Gemini processing even if ElevenLabs fails
      }
    }
  }
  
  // Continue with Gemini AI processing...
  const genAI = new GoogleGenerativeAI(apiKey);
  // ... rest of your code
});

// Option 2: Create a dedicated ElevenLabs endpoint
// File: server/api/elevenlabs/process-video.js

export default defineEventHandler(async (event) => {
  const { storyId, videoUrl, targetLang = 'en' } = await readBody(event);
  
  if (!videoUrl) {
    throw createError({
      statusCode: 400,
      message: 'Missing videoUrl'
    });
  }
  
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'ELEVENLABS_API_KEY not configured'
    });
  }
  
  try {
    // ElevenLabs API call
    const response = await fetch('https://api.elevenlabs.io/v1/dubbing', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: videoUrl,  // Public Firebase Storage URL
        target_lang: targetLang,
        source_lang: 'auto',
        num_speakers: 1,
        watermark: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.message || 'ElevenLabs API failed');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      storyId,
      dubbing_id: result.dubbing_id,
      expected_duration_sec: result.expected_duration_sec,
      message: 'ElevenLabs processing started'
    };
  } catch (error) {
    console.error('ElevenLabs error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to process video with ElevenLabs: ' + error.message
    });
  }
});

// Option 3: Call from frontend after story is created
// File: components/call/HostCallView.vue

const handleEndCall = async () => {
  // ... existing code ...
  
  // Upload recording to Firebase
  const videoUrl = await uploadFile(recordingBlob, filename);
  
  // Create story
  const storyId = await createStory(storyData);
  
  // Process with ElevenLabs (optional, in background)
  try {
    const elevenlabsResult = await $fetch('/api/elevenlabs/process-video', {
      method: 'POST',
      body: {
        storyId,
        videoUrl,  // ← Video URL from Firebase Storage
        targetLang: 'en'
      }
    });
    console.log('ElevenLabs processing:', elevenlabsResult);
  } catch (error) {
    console.warn('ElevenLabs processing failed:', error);
    // Continue even if ElevenLabs fails
  }
  
  // Process with Gemini
  await processStory({
    storyId,
    videoUrl,
    speakerName: storyData.speakerName
  });
  
  // ... rest of code ...
};

// Key Points:
// 1. videoUrl is a PUBLIC Firebase Storage URL - no authentication needed for external services
// 2. The URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/recordings%2F{file}
// 3. The video is .webm format with VP9/VP8 codec
// 4. Store ElevenLabs results back to Firestore for later retrieval
