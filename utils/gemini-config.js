// utils/gemini-config.js
// -------------------------------------------------------
// This sets up the Google Gemini AI client for use in
// our API routes. It reads your API key from the .env file.
// -------------------------------------------------------

import { GoogleGenerativeAI } from '@google/generative-ai'

export function getGeminiModel() {
  // Read the API key from your .env file
  const apiKey = process.env.GEMINI_API_KEY

  // If the key is missing, throw a clear error
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in your .env file!')
  }

  // Create the Gemini client with your key
  const genAI = new GoogleGenerativeAI(apiKey)

  // Return the model we want to use
  // gemini-1.5-flash is fast and free tier friendly
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}