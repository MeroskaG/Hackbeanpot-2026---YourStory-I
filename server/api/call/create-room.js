// API endpoint to create a Daily.co room
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.dailyApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Daily.co API key not configured'
    });
  }

  try {
    // Create a Daily room
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        properties: {
          enable_recording: 'cloud',
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create room');
    }

    const room = await response.json();
    
    return {
      success: true,
      roomName: room.name,
      roomUrl: room.url,
      expiresAt: room.config?.exp
    };
  } catch (error) {
    console.error('Error creating Daily room:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create video call room: ' + error.message
    });
  }
});
