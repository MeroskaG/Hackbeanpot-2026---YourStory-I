// server/api/gemini/process-story.js
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getDb } from '~/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const { storyId, speakerName, audioUrl, videoUrl } = await readBody(event)

  if (!storyId || !speakerName) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: storyId and speakerName'
    })
  }

  const geminiKey = process.env.GEMINI_API_KEY
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY

  if (!geminiKey) {
    throw createError({
      statusCode: 500,
      message: 'Missing GEMINI_API_KEY in .env file'
    })
  }

  const mediaUrl = audioUrl || videoUrl || null
  console.log('Processing story with media URL:', mediaUrl)

  // ── Save "processing" status to Firebase right away ────
  // Frontend can show a spinner while this runs
  const db = getDb()
  const storyRef = db.collection('stories').doc(storyId)
  await storyRef.set({
    storyId,
    speakerName,
    audioUrl: mediaUrl,
    processingStatus: 'processing',
    aiProcessed: false,
    createdAt: new Date()
  }, { merge: true })

  // ── Step 1: Transcribe with ElevenLabs ─────────────────
  let transcript = ''

  if (mediaUrl && elevenLabsKey) {
    try {
      console.log('Sending mp4 to ElevenLabs...')
      const formData = new FormData()
      formData.append('model_id', 'scribe_v2')
      formData.append('cloud_storage_url', mediaUrl)
      formData.append('diarize', 'true')
      formData.append('tag_audio_events', 'true')

      const transcribeResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: { 'xi-api-key': elevenLabsKey },
        body: formData
      })

      if (transcribeResponse.ok) {
        const result = await transcribeResponse.json()
        transcript = result.text || ''
        console.log(`Transcription done! ${transcript.length} characters`)
      } else {
        const err = await transcribeResponse.text()
        console.error('ElevenLabs error:', err)
      }
    } catch (transcribeError) {
      console.error('Transcription failed:', transcribeError.message)
    }
  } else {
    console.log('No mediaUrl — using placeholder')
  }

  if (!transcript) {
    transcript = `This is a story shared by ${speakerName} during a family video call.`
  }

  // ── Step 2: Gemini AI ───────────────────────────────────
  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  try {
    console.log('Running Gemini AI...')

    const [titleResult, summaryResult, tagsResult] = await Promise.all([
      model.generateContent(`Create a short title (5-8 words) for this family story. Return ONLY the title. Story by ${speakerName}: ${transcript.substring(0, 500)}`),
      model.generateContent(`You are preserving a family story. Write a warm 1 paragraph summary in third person (e.g. "She remembers..."). If the story seems incomplete, write a beautiful placeholder summary about ${speakerName} sharing family memories. Story: ${transcript}`),
      model.generateContent(`Extract 3-5 thematic tags from this family story. Choose from: Childhood, Immigration, War, Love, Family, Food, Work, Faith, Travel, Loss, Achievement, Culture, Humor, Home. Return ONLY comma-separated tags. Story: ${transcript.substring(0, 1000)}`)
    ])

    const title = titleResult.response.text().trim().replace(/['"]/g, '')
    const summary = summaryResult.response.text().trim().replace(/\\n/g, ' ').replace(/\n/g, ' ')
    const tags = tagsResult.response.text()
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    console.log(`Done! Title: ${title}`)

    // ── Step 3: Save results to Firebase ───────────────────
    await storyRef.set({
      storyId,
      speakerName,
      title,
      summary,
      transcript,
      tags,
      audioUrl: mediaUrl,
      aiProcessed: true,
      processingStatus: 'complete',
      completedAt: new Date()
    }, { merge: true })

    console.log(`Story saved to Firebase! storyId: ${storyId}`)

    return {
      success: true,
      storyId,
      data: {
        title,
        summary,
        tags,
        transcript,
        audioUrl: mediaUrl,
        aiProcessed: true,
        processingStatus: 'complete'
      }
    }

  } catch (error) {
    console.error('Gemini AI error:', error.message)

    // Save failed status to Firebase
    await storyRef.set({
      processingStatus: 'failed',
      processingError: error.message
    }, { merge: true })

    throw createError({
      statusCode: 500,
      message: `AI processing failed: ${error.message}`
    })
  }
})
