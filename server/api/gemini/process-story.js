// server/api/gemini/process-story.js
import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {

  const { storyId, speakerName, transcript, videoUrl } = await readBody(event)

  if (!storyId || !speakerName) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: storyId and speakerName'
    })
  }

  // videoUrl is available here for ElevenLabs API integration
  // Example: await fetch('https://api.elevenlabs.io/...', { body: { video_url: videoUrl } })
  console.log('Processing story with video URL:', videoUrl)

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Missing GEMINI_API_KEY in .env file'
    })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const storyText = transcript || `This is a placeholder story told by ${speakerName}. In production this would be the real transcript from the audio recording.`

  try {
    const [titleResult, summaryResult, tagsResult] = await Promise.all([

      model.generateContent(`Create a short title (5-8 words) for this family story. Return ONLY the title, nothing else. Story by ${speakerName}: ${storyText.substring(0, 500)}`),

      model.generateContent(`You are preserving a family story. Write a warm 1 paragraph summary in third (e.g. "she remembers.."). If the story seems  incomplete, write a beautiful placeholder summary about ${speakerName} sharing family memories. Story: ${storyText}`),

      model.generateContent(`Extract 3-5 thematic tags from this family story. Choose from: Childhood, Immigration, War, Love, Family, Food, Work, Faith, Travel, Loss, Achievement, Culture, Humor, Home. Return ONLY comma-separated tags, nothing else. Story: ${storyText.substring(0, 1000)}`)

    ])

    const title = titleResult.response.text().trim().replace(/['"]/g, '')
    const summary = summaryResult.response.text().trim().replace(/\\n/g, ' ').replace(/\n/g, ' ')
    const tags = tagsResult.response.text()
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    return {
      success: true,
      storyId,
      data: {
        title,
        summary,
        tags,
        transcript: storyText,
        aiProcessed: true,
        processingStatus: 'complete'
      }
    }

  } catch (error) {
    console.error('Gemini AI error:', error.message)
    throw createError({
      statusCode: 500,
      message: `AI processing failed: ${error.message}`
    })
  }
})