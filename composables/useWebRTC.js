// Composable for WebRTC video calling
// Simplified WebRTC implementation for MVP
export const useWebRTC = () => {
  const localStream = ref(null);
  const remoteStreams = ref(new Map());
  const peers = ref(new Map());
  const isConnected = ref(false);
  const error = ref(null);

  // Get user media (camera and microphone)
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      localStream.value = stream;
      return stream;
    } catch (err) {
      error.value = 'Failed to access camera/microphone';
      console.error('Error accessing media devices:', err);
      throw err;
    }
  };

  // Toggle microphone
  const toggleMicrophone = () => {
    if (localStream.value) {
      const audioTrack = localStream.value.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localStream.value) {
      const videoTrack = localStream.value.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  // Stop all tracks
  const stopAllTracks = () => {
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop());
      localStream.value = null;
    }
  };

  // Clean up
  const cleanup = () => {
    stopAllTracks();
    peers.value.clear();
    remoteStreams.value.clear();
    isConnected.value = false;
  };

  return {
    localStream,
    remoteStreams,
    isConnected,
    error,
    getUserMedia,
    toggleMicrophone,
    toggleCamera,
    stopAllTracks,
    cleanup
  };
};
