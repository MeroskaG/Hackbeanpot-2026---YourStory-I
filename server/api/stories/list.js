// server/api/stories/list.js
import { getDb } from '~/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const { speakerName } = getQuery(event)

  try {
    const db = getDb()
    let snapshot

    if (speakerName) {
      // Filter by speaker name
      snapshot = await db.collection('stories')
        .where('speakerName', '==', speakerName)
        .where('processingStatus', '==', 'complete')
        .get()
    } else {
      // Get all completed stories
      snapshot = await db.collection('stories')
        .where('processingStatus', '==', 'complete')
        .get()
    }

    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || null,
    }))

    console.log(`Found ${stories.length} real stories from Firebase`)

    return {
      success: true,
      stories,
      count: stories.length
    }

  } catch (error) {
    console.error('Failed to fetch stories:', error.message)
    throw createError({
      statusCode: 500,
      message: `Could not load stories: ${error.message}`
    })
  }
})