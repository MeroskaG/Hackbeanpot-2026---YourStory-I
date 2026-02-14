# Daily.co Integration Guide

## Overview

Family Stories uses Daily.co for video calling, which provides:
- Real-time multi-participant video calls
- Cloud recording capabilities
- Automatic connection management
- STUN/TURN server handling
- No need to manage WebRTC complexity

## Setup

### 1. Create a Daily.co Account

1. Go to [Daily.co](https://www.daily.co/)
2. Sign up for a free account
3. Go to the [Developers Dashboard](https://dashboard.daily.co/developers)

### 2. Get Your API Key

1. In the Daily.co dashboard, navigate to **Developers** → **API Keys**
2. Copy your API key
3. Add it to your `.env` file:
   ```
   DAILY_API_KEY=your_daily_api_key_here
   ```

### 3. Configure Daily.co Settings (Optional)

In your Daily.co dashboard, you can configure:
- **Domain**: Custom domain for your rooms (requires paid plan)
- **Recording**: Cloud recording settings
- **Privacy**: Room privacy settings
- **Webhooks**: Event notifications

## How It Works

### Room Creation

When a host creates a call:
1. Frontend calls `/api/call/create-room`
2. Backend creates a Daily.co room via their API
3. Room URL is returned and stored in Firebase
4. Host and guests use this URL to join the call

### Joining a Call

When someone joins:
1. Daily.co SDK is initialized
2. User joins the room with their display name
3. Video/audio tracks are automatically managed
4. Participants list is updated in real-time

### Recording

Host can start/stop cloud recording:
- Recording is stored in Daily.co's cloud
- Recordings can be downloaded later via Daily's API
- Recording URLs are provided after processing

## Daily.co Features Used

### Basic Features
- ✅ Video calling
- ✅ Audio calling
- ✅ Screen sharing (available but not implemented)
- ✅ Cloud recording
- ✅ Participant management

### Advanced Features (Optional)
- Live streaming
- SIP/PSTN integration
- Custom layouts
- Webhooks for events
- Recording composition

## API Endpoints

### Create Room
**POST** `/api/call/create-room`

Creates a new Daily.co room for a video call.

**Response:**
```json
{
  "success": true,
  "roomName": "room-name",
  "roomUrl": "https://domain.daily.co/room-name",
  "expiresAt": 1234567890
}
```

### Room Configuration

Rooms are created with these settings:
- `enable_recording`: Cloud recording enabled
- `enable_chat`: Disabled (we don't use chat)
- `enable_knocking`: Disabled (direct join)
- `max_participants`: 10
- `exp`: 4 hours from creation

## Composable: useWebRTC

The `useWebRTC` composable wraps Daily.co functionality:

```javascript
const {
  // State
  participants,      // Map of all participants
  isConnected,       // Connection status
  isMicEnabled,      // Microphone state
  isCameraEnabled,   // Camera state
  
  // Methods
  joinRoom,          // Join a Daily room
  leaveCall,         // Leave and cleanup
  toggleMicrophone,  // Toggle mic
  toggleCamera,      // Toggle camera
  getCallObject      // Get raw Daily object
} = useWebRTC();
```

## Components

### GuestCallView
- Joins Daily room automatically
- Simple 3-button interface
- Auto-cleanup on leave

### HostCallView
- Joins Daily room as host
- Starts cloud recording
- Full control interface
- Stops recording on end

### VideoGrid
- Displays all Daily participants
- Responsive grid layout
- Automatic scaling

### VideoTile
- Renders individual participant
- Shows video/audio tracks
- Status indicators

## Daily.co Pricing

**Free Tier:**
- 10,000 participant minutes/month
- Up to 10 participants per room
- Cloud recording (1GB storage)
- Perfect for MVP and demo

**Paid Plans:**
- Scale pricing starts at $99/month
- More participants
- More storage
- Custom domains
- SLA and support

## Troubleshooting

### Room Creation Fails
- Check API key is correct
- Verify Daily.co account is active
- Check network connectivity

### Can't Join Room
- Verify room URL is valid
- Check camera/microphone permissions
- Try in a different browser

### Recording Not Working
- Ensure recording is enabled in room creation
- Check Daily.co dashboard for recordings
- Verify sufficient storage quota

### Video/Audio Issues
- Check browser permissions
- Verify camera/microphone are working
- Test in Daily.co's [prebuilt UI](https://prebuilt.daily.co)

## Best Practices

1. **Error Handling**: Always wrap Daily calls in try-catch
2. **Cleanup**: Call `leaveCall()` before unmounting
3. **Permissions**: Request permissions before joining
4. **Testing**: Use Daily's test rooms for development
5. **Monitoring**: Check Daily dashboard for call quality metrics

## Advanced Usage

### Custom Events

Listen to Daily events:
```javascript
const callObject = getCallObject();
callObject.on('participant-joined', (event) => {
  console.log('New participant:', event.participant);
});
```

### Screen Sharing

Enable screen sharing:
```javascript
await callObject.startScreenShare();
```

### Custom Layouts

Configure video layout:
```javascript
await callObject.updateInputSettings({
  video: {
    processor: {
      type: 'background-blur'
    }
  }
});
```

## Resources

- [Daily.co Documentation](https://docs.daily.co/)
- [Daily.co API Reference](https://docs.daily.co/reference/rest-api)
- [Daily.co Examples](https://github.com/daily-co)
- [Daily.co Support](https://www.daily.co/contact)

## Migration from Simple WebRTC

If you were using basic WebRTC before:
- ✅ No need for signaling server
- ✅ No peer connection management
- ✅ Automatic STUN/TURN handling
- ✅ Better scalability
- ✅ Cloud recording included

---

**Daily.co makes real-time video simple and reliable! 🎥✨**
