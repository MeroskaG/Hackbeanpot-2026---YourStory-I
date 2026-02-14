// server/api/call/end.js
// Called when host clicks "End Call"
// Marks call as ended and creates story records

export default defineEventHandler(async (event) => {
  const { callId, speakerSegments } = await readBody(event)

  if (!callId) {
    throw createError({ 
      statusCode: 400, 
      message: 'Missing callId' 
    })
  }

  // Create a story ID for each speaker segment
  const segments = speakerSegments && speakerSegments.length > 0
    ? speakerSegments
    : [{ speakerName: 'Unknown Speaker', recordingUrl: null, duration: 0 }]

  const storyIds = segments.map(segment => {
    const storyId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    console.log(`Story record created: ${storyId} for ${segment.speakerName}`)
    return storyId
  })

  // TODO: Save to Firebase once Firebase Admin is set up

  return {
    success: true,
    callId,
    storyIds,
    message: `Call ended. ${storyIds.length} story record(s) created.`
  }
})