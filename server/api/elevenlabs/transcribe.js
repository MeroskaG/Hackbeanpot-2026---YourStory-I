// server/api/elevenlabs/transcribe.js
// -------------------------------------------------------
// Transcribes an mp4 from Firebase Storage using ElevenLabs
// Uses cloud_storage_url parameter so we don't need to
// download the file first - ElevenLabs fetches it directly!
//
// POST /api/elevenlabs/transcribe
// Body: { audioUrl, speakerName }
// -------------------------------------------------------

export default defineEventHandler(async (event) => {
  const { audioUrl, speakerName } = await readBody(event)

  if (!audioUrl) {
    throw createError({
      statusCode: 400,
      message: 'Missing audioUrl - need the Firebase Storage mp4 URL'
    })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Missing ELEVENLABS_API_KEY in .env file'
    })
  }

  try {
    console.log(`Sending Firebase URL to ElevenLabs for ${speakerName}...`)

    // Build the form data
    // We use cloud_storage_url so ElevenLabs fetches the mp4 directly
    // from Firebase - no need to download it ourselves first!
    const formData = new FormData()
    formData.append('model_id', 'scribe_v2')
    formData.append('cloud_storage_url', audioUrl)

    // Enable speaker diarization so it can tell who is speaking
    formData.append('diarize', 'true')

    // Tag audio events like [laughter], [applause] etc
    formData.append('tag_audio_events', 'true')

    // Word level timestamps
    formData.append('timestamps_granularity', 'word')

    // Send to ElevenLabs Speech to Text API
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        // API key goes in the header
        'xi-api-key': apiKey
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs error ${response.status}: ${errorText}`)
    }

    const result = await response.json()

    // result.text contains the full transcript
    const transcript = result.text || ''

    // result.language_code tells us what language was detected
    const language = result.language_code || 'unknown'

    console.log('Transcription complete!')
    console.log(`Language detected: ${language}`)
    console.log(`Characters: ${transcript.length}`)
    console.log(`Preview: ${transcript.substring(0, 150)}...`)

    return {
      success: true,
      transcript,
      language,
      speakerName,
      characterCount: transcript.length
    }
  } catch (error) {
    console.error('ElevenLabs transcription failed:', error.message)
    throw createError({
      statusCode: 500,
      message: `Transcription failed: ${error.message}`
    })
  }
})
