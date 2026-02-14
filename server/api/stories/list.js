// server/api/stories/list.js
// Fetches stories from Firebase
// Called by the Collections page to show family member stories
//
// Usage:
//   GET /api/stories/list                        ← all stories
//   GET /api/stories/list?speakerName=Grandma    ← filtered by speaker

export default defineEventHandler(async (event) => {
  const { speakerName } = getQuery(event)

  // TODO: Replace this mock data with real Firebase queries
  // once Firebase Admin SDK is set up
  // 
  // Real version will look like:
  //   const db = getDb()
  //   const snapshot = await db.collection('stories')
  //     .where('speakerName', '==', speakerName)
  //     .orderBy('timestamp', 'desc')
  //     .get()

  // Mock data for now so the frontend can be built and tested
  const mockStories = [
    {
      id: 'story_001',
      storyId: 'story_001',
      speakerName: 'Grandma Rose',
      title: 'Coming to America in 1965',
      summary: 'A heartfelt story about immigration and new beginnings...',
      tags: ['Immigration', 'Family', 'Childhood'],
      duration: 180,
      timestamp: new Date().toISOString(),
      aiProcessed: true,
      processingStatus: 'complete'
    },
    {
      id: 'story_002',
      storyId: 'story_002',
      speakerName: 'Uncle Bob',
      title: 'Summer Days on the Farm',
      summary: 'Memories of growing up on the family farm...',
      tags: ['Childhood', 'Family', 'Home'],
      duration: 120,
      timestamp: new Date().toISOString(),
      aiProcessed: true,
      processingStatus: 'complete'
    }
  ]

  // Filter by speaker name if provided
  const stories = speakerName
    ? mockStories.filter(s => s.speakerName === speakerName)
    : mockStories

  console.log(`Returning ${stories.length} stories${speakerName ? ` for ${speakerName}` : ''}`)

  return {
    success: true,
    stories,
    count: stories.length
  }
})