# Family Stories - Video Call & Story Preservation Web Application

> 🏆 Built for HackBeanpot 2026

A video calling web application that records family stories and uses AI to organize them into digital storybooks. Preserve your family's heritage, one story at a time.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [Development Notes](#development-notes)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**Family Stories** is a desktop-first web application designed to help families preserve precious memories through video calls. The app records conversations, uses AI to transcribe and summarize stories, and organizes them by speaker for easy access.

### The Problem We're Solving

Family stories and cultural heritage are often lost across generations. This app makes it easy to:
- Record video calls with elderly family members
- Capture stories and memories in their own words
- Use AI to organize and summarize these stories
- Create a permanent digital archive for future generations

---

## ✨ Features

### Core Features (Implemented)

- **🔐 Host Authentication**: Secure login via Auth0 for call hosts
- **👥 Guest Access**: Zero-friction joining for family members (no login required)
- **🎥 Video Calling**: WebRTC-based video calls optimized for desktop
- **📹 Recording**: Automatic recording of calls (host side)
- **🎤 Speaker Tagging**: Manual speaker selection for organizing recordings
- **🤖 AI Processing**: Google Gemini for transcription, summarization, and tagging
- **📚 Collections**: Organize stories by family member
- **🔗 Shareable Links**: Easy call invitations via link

### Optional Features (Placeholder Implementation)

- **🪙 NFT Minting**: Mint stories as NFTs on Solana blockchain (placeholder)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Nuxt 3 (Vue 3)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Video/Audio**: WebRTC (MediaRecorder API)

### Backend
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Auth0
- **AI Processing**: Google Gemini API
- **Blockchain** (Optional): Solana

### Development
- **Node.js**: 18+
- **Package Manager**: npm
- **Target Platform**: Desktop/Laptop browsers (Chrome, Firefox, Safari, Edge)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git**

You'll also need accounts for:
- [Firebase](https://firebase.google.com/) (Free plan is sufficient)
- [Auth0](https://auth0.com/) (Free plan is sufficient)
- [Google AI Studio](https://makersuite.google.com/app/apikey) (For Gemini API key)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/family-stories.git
cd family-stories
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Nuxt 3
- Vue 3
- Tailwind CSS
- Auth0 SDK
- Firebase SDK
- Google Generative AI SDK
- And other dependencies

---

## ⚙️ Configuration

### Step 1: Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in your credentials in the `.env` file:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Solana Configuration (OPTIONAL)
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WALLET_SECRET_KEY=[your,wallet,secret,key,array]
```

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location close to your users
4. Enable **Firebase Storage**:
   - Go to Storage
   - Get started with default security rules
5. Get your configuration:
   - Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the configuration values to your `.env` file

### Step 3: Auth0 Setup

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application:
   - Type: **Single Page Application**
   - Name: "Family Stories"
3. Configure settings:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Copy your Domain and Client ID to `.env`
5. Enable the authentication method you want (Email/Password, Google, etc.)

### Step 4: Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key to your `.env` file

---

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### Build for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
family-stories/
├── assets/
│   └── css/
│       └── main.css              # Global styles with Tailwind
├── components/
│   ├── call/                     # Video call components
│   │   ├── GuestCallView.vue     # Minimal guest interface
│   │   ├── HostCallView.vue      # Full host interface
│   │   ├── PreJoinScreen.vue     # Pre-call setup
│   │   ├── VideoGrid.vue         # Video grid layout
│   │   ├── VideoTile.vue         # Individual video tile
│   │   ├── MuteButton.vue        # Microphone control
│   │   ├── CameraButton.vue      # Camera control
│   │   ├── LeaveCallButton.vue   # Guest leave button
│   │   ├── EndCallButton.vue     # Host end call button
│   │   ├── SpeakerSelector.vue   # Speaker selection dropdown
│   │   ├── RecordingIndicator.vue # Recording status
│   │   └── CopyLinkButton.vue    # Copy invite link
│   ├── collections/              # Collection components
│   │   ├── FamilyMemberCard.vue  # Family member display
│   │   └── StoryCard.vue         # Story list item
│   ├── story/                    # Story components
│   │   └── VideoPlayer.vue       # Video playback
│   ├── InviteLinkModal.vue       # Share call link modal
│   ├── MintNftButton.vue         # NFT minting (optional)
│   └── ProcessingIndicator.vue   # AI processing status
├── composables/
│   ├── useAuth0.js               # Auth0 integration
│   ├── useFirebase.js            # Firebase operations
│   ├── useWebRTC.js              # WebRTC functionality
│   ├── useRecording.js           # Recording logic
│   └── useGemini.js              # AI processing
├── middleware/
│   └── auth.js                   # Route protection
├── pages/
│   ├── index.vue                 # Sign in page (host only)
│   ├── callback.vue              # Auth0 callback
│   ├── collections.vue           # Collections page
│   ├── collections/
│   │   └── [memberId].vue        # Member stories page
│   ├── call/
│   │   └── [id].vue              # Video call page
│   └── stories/
│       └── [id].vue              # Story detail page
├── plugins/
│   └── auth0.client.js           # Auth0 plugin
├── server/
│   └── api/
│       ├── gemini/
│       │   └── process-story.js  # AI processing endpoint
│       └── solana/
│           └── mint-nft.js       # NFT minting (optional)
├── utils/
│   ├── auth0-config.js           # Auth0 configuration
│   ├── firebase-config.js        # Firebase initialization
│   └── gemini-config.js          # Gemini configuration
├── .env                          # Environment variables (create from .env.example)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── app.vue                       # Root component
├── nuxt.config.ts                # Nuxt configuration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

---

## 🔑 Key Features Explained

### 1. Two-Tier User Experience

**Host (Authenticated)**:
- Full dashboard with all features
- Can create calls and get shareable links
- Records and manages calls
- Selects who's speaking during recording
- Views and manages story collection

**Guest (No Login)**:
- Clicks link → Enters name → Joins call instantly
- Simple interface: video grid + 3 buttons (mute, camera, leave)
- No account needed, no complexity

### 2. AI Story Processing

When a call ends, the recording is automatically:
1. Uploaded to Firebase Storage
2. Sent to Gemini API for processing
3. Transcribed (placeholder in MVP - would use Whisper API)
4. Summarized into 2-3 paragraphs
5. Given a descriptive title
6. Tagged with relevant themes

### 3. Speaker-Based Organization

- During recording, host manually selects current speaker
- Recordings are timestamped and associated with speakers
- Stories are automatically organized by family member
- Easy browsing of stories by person

---

## 💻 Development Notes

### Design Philosophy

- **Desktop-First**: Optimized for 1366x768 and above
- **Simplicity**: Minimal features, maximum clarity
- **Clear Naming**: Every component has a descriptive name
- **Single Responsibility**: Each component does one thing well
- **Guest-Friendly**: Zero barriers for family members to join

### Testing Locally

1. **Test Host Flow**:
   - Sign in with Auth0
   - Create a new call
   - Copy the invite link

2. **Test Guest Flow**:
   - Open the invite link in an incognito/private window
   - Enter a name
   - Join the call without signing in

3. **Test Recording**:
   - As host, select a speaker
   - End the call
   - Check that the recording is saved

### Common Issues

**Issue**: Camera/microphone not working
- **Solution**: Grant browser permissions for camera/microphone

**Issue**: Auth0 login fails
- **Solution**: Check Auth0 callback URL is correctly configured

**Issue**: Firebase connection errors
- **Solution**: Verify Firebase configuration in `.env`

**Issue**: AI processing fails
- **Solution**: Check Gemini API key is valid and has quota

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables from `.env`
5. Deploy!

Update Auth0 callback URLs to include your production domain.

### Deploy to Netlify

1. Build the application: `npm run build`
2. Deploy the `.output/public` directory
3. Configure environment variables
4. Update Auth0 callback URLs

---

## ⚠️ Known Limitations

This is an MVP built for a hackathon. Known limitations include:

1. **WebRTC**: Simplified implementation - only shows local video
   - **Full implementation would require**: Signaling server, peer connections
   
2. **AI Transcription**: Uses placeholder transcript
   - **Full implementation would require**: OpenAI Whisper API or similar

3. **Solana NFTs**: Placeholder implementation
   - **Full implementation would require**: Metaplex SDK, IPFS storage

4. **Mobile Support**: Not optimized for mobile devices
   - Desktop/laptop only for MVP

5. **Error Handling**: Basic error handling
   - Production app would need more robust error recovery

---

## 🔮 Future Enhancements

Potential features for future versions:

- **Real-time Transcription**: Live transcription during calls
- **Multi-Speaker Detection**: Automatic speaker identification
- **Timeline View**: Visual timeline of family stories
- **Search Functionality**: Search across all transcripts
- **Export Options**: Download stories as PDF/eBook
- **Email Notifications**: Notify family when new stories are added
- **Mobile App**: Native mobile applications
- **Advanced Editing**: Edit transcripts and summaries
- **Relationship Mapping**: Visual family tree with story links
- **Multiple Languages**: Multi-language support for transcription

---

## 📄 License

This project was built for HackBeanpot 2026.

---

## 🙏 Acknowledgments

- Built with Nuxt 3, Vue 3, and Tailwind CSS
- Authentication by Auth0
- Database and storage by Firebase
- AI processing by Google Gemini
- Blockchain (optional) by Solana

---

## 📞 Support

For issues or questions:
1. Check the [Known Limitations](#known-limitations) section
2. Review the [Development Notes](#development-notes)
3. Check the browser console for error messages

---

**Happy storytelling! 👨‍👩‍👧‍👦📖✨**
HackBeanPot 2026 project that will aid in remebering ones heritage through family story using our webpage. 
