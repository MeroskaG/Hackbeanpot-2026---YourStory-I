// server/api/call/create.js
// Creates a new video call session in Firebase
// Called when host clicks "Start New Call"

export default defineEventHandler(async (event) => {
  const { hostId, hostName } = await readBody(event)

  if (!hostId) {
    throw createError({ 
      statusCode: 400, 
      message: 'Missing hostId - user must be logged in' 
    })
  }

  // Generate a unique call ID
  const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // TODO: Save to Firebase once Firebase Admin is set up
  // For now we return the callId so the frontend can build the invite link
  console.log(`New call created: ${callId} by ${hostName}`)

  return {
    success: true,
    callId,
    message: 'Call created! Share this ID with family members.'
  }
})