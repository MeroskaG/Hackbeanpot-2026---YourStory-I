<template>
  <div class="relative h-screen flex flex-col" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <!-- Animated background elements -->
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.2 }"
      :enter="{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
        transition: {
          duration: 8000,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }"
      class="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
    />
    <div
      v-motion
      :initial="{ scale: 1, opacity: 0.2 }"
      :enter="{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.3, 0.2],
        transition: {
          duration: 10000,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1000
        }
      }"
      class="absolute bottom-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"
    />
    
    <!-- Recording Indicator -->
    <CallRecordingIndicator :isRecording="isRecording" />

    <!-- Video Grid -->
    <div class="relative z-10 flex-1 p-4">
      <CallVideoGrid :isHost="true" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 p-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Left: Media Controls -->
        <div class="flex items-center space-x-4">
          <CallMuteButton @toggle="toggleMute" :isMuted="!isMicEnabled" />
          <CallCameraButton @toggle="toggleCamera" :isCameraOff="!isCameraEnabled" />
        </div>

        <!-- Center: Speaker Selector -->
        <div class="flex-1 px-8">
          <CallSpeakerSelector
            :participants="participantNames"
            :currentSpeaker="currentSpeaker"
            @select="handleSpeakerSelect"
          />
        </div>

        <!-- Right: Call Actions -->
        <div class="flex items-center space-x-4">
          <CallCopyLinkButton :callId="callId" />
          <CallEndCallButton @end="handleEndCall" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Host Call View - Full-featured interface for managing recording
// Uses Daily.co for video calling and Daily.co's local recording API
const props = defineProps({
  callId: {
    type: String,
    required: true
  },
  roomUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['leave']);

const { 
  joinRoom, 
  leaveCall, 
  toggleMicrophone, 
  toggleCamera: toggleCameraWebRTC,
  participants,
  isMicEnabled,
  isCameraEnabled,
  getCallObject,
  getRecordingStream
} = useWebRTC();

const { 
  setSpeaker, 
  currentSpeaker, 
  startRecording, 
  stopRecording, 
  isRecording,
  speakerSegments,
  downloadRecording
} = useRecording();

const { createStory, uploadFile, endCall, updateCall } = useFirebase();
const { processStory } = useGemini();

// Get participant names
const participantNames = computed(() => {
  const names = [];
  participants.value.forEach(participant => {
    if (!participant.isLocal) {
      names.push(participant.name);
    }
  });
  return names.length > 0 ? names : ['Guest'];
});

// Join Daily room on mount
onMounted(async () => {
  try {
    const hostName = 'Host';
    await joinRoom(props.roomUrl, hostName);
    
    // Start local browser recording
    await startLocalRecording();
    
    // Update call participants
    await updateCall(props.callId, {
      participants: [{ name: hostName, joinedAt: new Date() }]
    });
  } catch (error) {
    console.error('Error joining room:', error);
    alert('Failed to join call');
    emit('leave');
  }
});

// Start MediaRecorder-based local recording
const startLocalRecording = async () => {
  try {
    // Wait a moment for Daily to fully connect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const callObject = getCallObject();
    if (callObject) {
      await startRecording(callObject);
      console.log('MediaRecorder local recording started');
    } else {
      console.warn('Call object not available');
    }
  } catch (error) {
    console.error('Error starting MediaRecorder recording:', error);
  }
};

// Stop MediaRecorder local recording
const stopLocalRecording = async () => {
  try {
    const recordingBlob = await stopRecording();
    return recordingBlob;
  } catch (error) {
    console.error('Error stopping MediaRecorder recording:', error);
    return null;
  }
};

// Toggle mute
const toggleMute = () => {
  toggleMicrophone();
};

// Toggle camera
const toggleCamera = () => {
  toggleCameraWebRTC();
};

// Handle speaker selection
const handleSpeakerSelect = (speaker) => {
  setSpeaker(speaker);
};

// Handle end call
const handleEndCall = async () => {
  if (!confirm('Are you sure you want to end the call? This will save and process the recording.')) {
    return;
  }

  try {
    // Stop local recording and get blob
    const recordingBlob = await stopLocalRecording();
    
    if (!recordingBlob) {
      alert('No recording available. The call will end without saving.');
      await leaveCall();
      emit('leave');
      return;
    }
    
    console.log('Recording captured, size:', recordingBlob.size, 'bytes');
    
    // Download recording locally to user's computer
    const timestamp = Date.now();
    const localFilename = `call_${props.callId}_${timestamp}.webm`;
    const downloaded = downloadRecording(localFilename);
    
    if (downloaded) {
      console.log('Recording downloaded to local computer');
    }
    
    // Show processing message
    alert('Recording saved locally! Now uploading to cloud...');
    
    // Upload recording to Firebase Storage
    const filename = `recordings/${props.callId}_${timestamp}.webm`;
    
    console.log('Starting upload...', {
      blobSize: recordingBlob.size,
      blobType: recordingBlob.type,
      filename
    });
    
    try {
      const videoUrl = await uploadFile(recordingBlob, filename);
      console.log('Recording uploaded to cloud successfully:', videoUrl);
      
      // Create story with the recording
      const storyData = {
        callId: props.callId,
        videoUrl,
        speakerName: currentSpeaker.value || participantNames.value[0] || 'Guest',
        speakerSegments: speakerSegments.value,
        duration: recordingBlob.size,
        createdAt: new Date(),
        processed: false
      };
      
      const storyId = await createStory(storyData);
      console.log('Story created:', storyId);
      
      // Process with Gemini AI and prepare for ElevenLabs
      // This can be moved to a separate background task
      try {
        await processStory({
          storyId,
          videoUrl,  // This URL can be used by ElevenLabs API
          speakerName: storyData.speakerName,
          transcript: '' // Add transcript if available
        });
      } catch (aiError) {
        console.warn('AI processing failed, but recording saved:', aiError);
      }
      
      // Mark call as ended
      await endCall(props.callId);
      
      alert('Recording saved locally and uploaded to cloud successfully!');
    } catch (uploadError) {
      console.error('Cloud upload failed:', uploadError);
      console.error('Upload error details:', {
        message: uploadError.message,
        code: uploadError.code,
        stack: uploadError.stack
      });
      alert(`Recording saved locally, but cloud upload failed: ${uploadError.message}. You can find the recording in your Downloads folder.`);
    }
    
    // Leave the Daily room
    await leaveCall();
    
    // Navigate to the story or collections
    emit('leave');
  } catch (error) {
    console.error('Error ending call:', error);
    alert('Error saving recording: ' + error.message);
  }
};

// Cleanup on unmount
onBeforeUnmount(async () => {
  if (isRecording.value) {
    await stopLocalRecording();
  }
  await leaveCall();
});
</script>
