// Google Gemini AI configuration
export const geminiConfig = {
  model: 'gemini-pro',
  maxOutputTokens: 2048,
  temperature: 0.7,
};

export const getGeminiApiKey = (): string => {
  const config = useRuntimeConfig();
  return config.geminiApiKey || '';
};
