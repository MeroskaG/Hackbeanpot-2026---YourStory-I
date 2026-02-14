# Quick Start Guide - Family Stories

## 🎯 For Hackathon Judges / Quick Demo

### Fast Setup (5 minutes)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Add your Firebase, Auth0, and Gemini API credentials
   - See detailed instructions in README.md

3. **Start the development server**:
   ```bash
   npm run dev // yarn dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:3000`

---

## 🧪 Testing the Application

### Test Scenario 1: Host Creates a Call

1. Go to `http://localhost:3000`
2. Click "Sign In" (Auth0 login)
3. Once signed in, you'll see the Collections page
4. Click "Start New Call"
5. A modal will show the shareable link
6. Copy the link
7. Click "Join Call Now"
8. Allow camera/microphone permissions
9. You're now in the call as the host!

### Test Scenario 2: Guest Joins Call

1. Open the copied invite link in an incognito/private browser window
2. Enter your name (e.g., "Grandma Mary")
3. Click "Join Call"
4. Allow camera/microphone permissions
5. You're in the call as a guest - notice the simple interface!

### Test Scenario 3: Recording & Speaker Selection

1. As the host, notice the "Recording" indicator at the top
2. Use the "Who's Talking?" dropdown to select the current speaker
3. Try the mute and camera buttons
4. Click "End Call" when done
5. The recording will be processed and saved

### Test Scenario 4: View Stories

1. After ending a call, go back to Collections
2. You should see family members listed
3. Click on a family member to see their stories
4. Click on a story to view details, summary, and transcript

---

## 🎨 Key Features to Demonstrate

### 1. Zero-Friction Guest Experience
- **Show**: Guest can join with just a name, no signup
- **Highlight**: Simple 3-button interface (mute, camera, leave)

### 2. Host Management
- **Show**: Host has full control with speaker selector
- **Highlight**: Recording indicator, invite link sharing

### 3. AI Processing
- **Show**: AI-generated title, summary, and tags
- **Highlight**: Automatic organization by speaker

### 4. Collections Organization
- **Show**: Stories organized by family member
- **Highlight**: Easy browsing and playback

---

## 🎬 Demo Script (2 minutes)

**Opening** (10 seconds):
"Family Stories helps preserve family memories through video calls and AI organization."

**Host Flow** (30 seconds):
1. "I sign in as the host..."
2. "Click Start New Call..."
3. "Get a shareable link..."
4. "Join the call..."

**Guest Flow** (20 seconds):
1. "Family members click the link..."
2. "Enter their name - no signup needed..."
3. "And they're in! Notice the simple interface."

**Recording** (30 seconds):
1. "As host, I select who's speaking..."
2. "The call is automatically recorded..."
3. "When I end the call..."

**AI Processing** (30 seconds):
1. "AI processes the recording..."
2. "Generates a title and summary..."
3. "Organizes stories by person..."
4. "Now I can browse all our family stories!"

**Closing** (10 seconds):
"Never lose precious family memories again!"

---

## 🐛 Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions
- Try refreshing the page
- Make sure no other app is using the camera

### Auth0 Login Fails
- Verify Auth0 configuration in `.env`
- Check callback URL is set correctly
- Make sure Auth0 app is configured for Single Page Application

### No Stories Showing Up
- Check Firebase configuration
- Verify Firestore is enabled
- Make sure you completed a call and ended it properly

### AI Processing Not Working
- Verify Gemini API key is correct
- Check API key has quota remaining
- Look at browser console for errors

---

## 📝 Notes for Development

### MVP Limitations
This is a hackathon MVP. The following are simplified:

- **WebRTC**: Shows local video only (full P2P would need signaling server)
- **Transcription**: Uses placeholder (production would use Whisper API)
- **NFT Minting**: Placeholder implementation

### What's Production-Ready
- Auth0 authentication flow
- Firebase integration
- Gemini AI integration
- UI/UX design
- Component architecture

---

## 🚀 Next Steps After Hackathon

To make this production-ready:

1. **Implement Real WebRTC**:
   - Add signaling server (Socket.io)
   - Implement peer-to-peer connections
   - Handle multiple participants

2. **Add Real Transcription**:
   - Integrate OpenAI Whisper API
   - Process actual audio from recordings

3. **Complete Solana Integration** (optional):
   - Implement Metaplex NFT minting
   - Add IPFS for metadata storage

4. **Add More Features**:
   - Real-time transcription during calls
   - Search functionality
   - Export options
   - Mobile support

---

## 📞 Quick Reference

### Important URLs
- Local development: `http://localhost:3000`
- Auth0 dashboard: `https://manage.auth0.com/`
- Firebase console: `https://console.firebase.google.com/`
- Google AI Studio: `https://makersuite.google.com/app/apikey`

### Key Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Project Stats
- **Pages**: 6 (index, callback, collections, call, story detail, member detail)
- **Components**: 20+
- **Composables**: 5
- **API Routes**: 2
- **Lines of Code**: ~3,000+

---

**Good luck with your demo! 🎉**
