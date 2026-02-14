<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Recording Indicator -->
    <CallRecordingIndicator :isRecording="isRecording" />

    <!-- Video Grid -->
    <div class="flex-1 p-4">
      <CallVideoGrid :isHost="true" />
    </div>

    <!-- Bottom Control Panel -->
    <div class="bg-gray-800 border-t border-gray-700 p-4">
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
  speakerSegments 
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

// Start Daily.co local recording
const startLocalRecording = async () => {
  try {
    // Wait a moment for Daily to fully connect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const callObject = getCallObject();
    if (callObject) {
      await startRecording(callObject);
      console.log('Daily.co local recording started');
    } else {
      console.warn('Call object not available');
    }
  } catch (error) {
    console.error('Error starting Daily.co recording:', error);
  }
};

// Stop Daily.co local recording
const stopLocalRecording = async () => {
  try {
    const recordingBlob = await stopRecording();
    return recordingBlob;
  } catch (error) {
    console.error('Error stopping Daily.co recording:', error);
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
    
    // Show processing message
    alert('Processing recording... This may take a moment.');
    
    // Upload recording to Firebase Storage
    const timestamp = Date.now();
    const filename = `recordings/${props.callId}_${timestamp}.webm`;
    const videoUrl = await uploadFile(recordingBlob, filename);
    
    console.log('Recording uploaded:', videoUrl);
    
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
    
    // Leave the Daily room
    await leaveCall();
    
    // Navigate to the story or collections
    alert('Recording saved successfully!');
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
