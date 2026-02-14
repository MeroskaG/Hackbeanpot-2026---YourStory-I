// Composable for Gemini AI processing
export const useGemini = () => {
  const isProcessing = ref(false);
  const processingError = ref(null);
  
  // Process story with AI (transcription, summary, title, tags)
  const processStory = async (storyData) => {
    isProcessing.value = true;
    processingError.value = null;
    
    try {
      const result = await $fetch('/api/gemini/process-story', {
        method: 'POST',
        body: storyData
      });
      
      return result;
    } catch (error) {
      processingError.value = error.message;
      console.error('Error processing story:', error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };
  
  return {
    isProcessing,
    processingError,
    processStory
  };
};
