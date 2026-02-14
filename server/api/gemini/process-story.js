// API endpoint for processing stories with Google Gemini AI
// Handles transcription, summarization, title generation, and tag extraction
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const { storyId, audioUrl, speakerName } = await readBody(event);
  
  if (!storyId || !audioUrl || !speakerName) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: storyId, audioUrl, speakerName'
    });
  }

  try {
    const config = useRuntimeConfig();
    const apiKey = config.geminiApiKey;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // For MVP, using placeholder transcript
    // In production, you would:
    // 1. Download audio from audioUrl
    // 2. Use Whisper API or similar for transcription
    // 3. Pass transcript to Gemini for processing
    
    const placeholderTranscript = `This is a placeholder transcript for the story by ${speakerName}. 
    
In a full implementation, this would be the actual transcription of the audio/video recording using a service like OpenAI's Whisper API or Google's Speech-to-Text API.

The transcript would capture the actual words spoken during the recording, with timestamps and speaker identification.`;

    // Generate everything in parallel for speed
    const [summaryResult, titleResult, tagsResult] = await Promise.all([
      // Generate summary
      model.generateContent(`
        Summarize this family story in 2-3 paragraphs.
        Focus on key events and emotional moments.
        Keep it warm and personal.
        
        Story by ${speakerName}:
        ${placeholderTranscript}
      `),
      
      // Generate title
      model.generateContent(`
        Create a 5-8 word title for this family story.
        Make it descriptive and emotional.
        Return only the title, nothing else.
        
        ${placeholderTranscript.substring(0, 500)}
      `),
      
      // Extract tags
      model.generateContent(`
        Extract 3-5 thematic tags for this story.
        Use themes like: Immigration, Childhood, War, Marriage, Career, Family, Celebration, Loss, etc.
        Return only comma-separated tags, nothing else.
        
        ${placeholderTranscript.substring(0, 1000)}
      `)
    ]);
    
    // Extract results
    const summary = summaryResult.response.text();
    const title = titleResult.response.text().trim().replace(/['"]/g, '');
    const tags = tagsResult.response.text()
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    // Return processed data
    // In production, this would update the story in Firebase
    return {
      success: true,
      storyId,
      data: {
        transcript: placeholderTranscript,
        summary,
        title,
        tags,
        aiProcessed: true,
        processingStatus: 'complete'
      }
    };
    
  } catch (error) {
    console.error('AI processing failed:', error);
    
    return {
      success: false,
      error: error.message,
      storyId
    };
  }
});
