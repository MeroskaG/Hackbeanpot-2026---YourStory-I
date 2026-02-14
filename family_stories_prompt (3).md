## Tech Stack## Design Philosophy

**Desktop-First Approach:**
- All designs and layouts should be optimized for laptop/desktop screens first
- Minimum supported resolution: 1366x768
- Target resolution: 1920x1080 (Full HD)
- Mobile responsiveness is NOT a priority for this MVP
- Focus on keyboard navigation and mouse interactions
- Assume users have a stable internet connection and full-size screens

**Simplicity & Clarity First:**
- **Keep features minimal** - Only build what's essential for the MVP
- **Clear component names** - Every Vue component should have a descriptive, obvious name (e.g., `VideoCallGrid.vue`, `StoryTitleDisplay.vue`, `MuteButton.vue`)
- **Single responsibility** - Each component does ONE thing well
- **No over-engineering** - Avoid abstractions, complex state management, or unnecessary libraries
- **Readable code** - Prioritize clarity over cleverness
- **Clear visual hierarchy** - Users should immediately understand what each section does

**Guest Access Priority:**
- **No login required for guests** - Family members joining via link should go DIRECTLY to the video call
- Guests only need to provide their display name
- Host manages the call (recording, speaker selection)
- Guests see a simplified interface (just video grid + basic controls)

**Simplicity & Clarity First:**
- **Keep features minimal** - Only build what's essential for the MVP
- **Clear component labels** - Every button, section# Family Stories Video Call Web Application - Development Prompt

## Project Overview

Build a minimal viable prototype of a video calling web application that records family stories and organizes them into digital storybooks. This is for a hackathon, so prioritize clean, understandable code over complex features.

## Problem Statement

We want to create a webapp that can be used for video calls that takes recordings of the call and uses AI to detail stories and memories being told to provide you your own personal story book. The purpose of this is to maintain a collection of stories that will aid in remembering ones heritage and keeping one's culture intact as well as pass it down.

## Tech Stack

- **Frontend Framework**: Vue 3 with Nuxt 3
- **Styling**: Tailwind CSS (for rapid development)
- **Video/Audio**: WebRTC (using simple-peer or daily.co API for easier implementation)
- **Database**: Firebase (Firestore + Storage)
- **Authentication**: Auth0 (for host login only - guests don't need auth)
- **State Management**: Pinia (Nuxt 3 default)
- **AI Processing**: Google Gemini API (for transcription, summarization, title generation)
- **Blockchain**: Solana (for NFT minting and permanent story storage)
- **Target Platform**: Desktop/Laptop browsers (Chrome, Firefox, Safari, Edge)
- **Minimum Resolution**: 1366x768

## Design Philosophy

**Desktop-First Approach:**
- All designs and layouts should be optimized for laptop/desktop screens first
- Minimum supported resolution: 1366x768
- Target resolution: 1920x1080 (Full HD)
- Mobile responsiveness is NOT a priority for this MVP
- Focus on keyboard navigation and mouse interactions
- Assume users have a stable internet connection and full-size screens

## Core Pages (Frontend Priority)

### 1. Sign In Page (`/`)

#### Layout & Components

**MINIMAL LOGIN PAGE**

**Header Section**
- App logo/icon (top-left)
- App name: "Family Stories"
- Tagline: "Preserve your family's heritage, one story at a time"

**Main Authentication Card** (centered on page)
- **Auth0 Login Button** (primary, large, centered)
  - "Sign In with Auth0" or "Continue with Email"
  - Handles entire auth flow via Auth0
- Small text below: "For family members joining a call, no login needed - just click the link!"

**Footer Section**
- Brief description: "Record video calls with family. AI organizes stories by person. Never lose precious memories."

#### Functionality
- Single Auth0 login button - Auth0 handles everything (email, password, social, etc.)
- Redirect to `/collections` after successful login
- Route guard: redirect to `/collections` if already authenticated
- **Guests bypass this page entirely** - they use the direct call link

#### Design Notes
- Clean, minimal design with plenty of white space
- Warm color scheme (earth tones or family-friendly colors)
- **Optimized for laptop/desktop screens first (1366x768 minimum)**
- Mobile responsiveness is secondary priority
- Accessible form labels and ARIA attributes

---

## Auth0 Integration Details

### Overview
Use Auth0 for host authentication only. Guests join calls without any authentication.

### Required Package
```bash
npm install @auth0/auth0-vue
```

### Setup

#### 1. Auth0 Configuration (`/utils/auth0-config.js`)
```javascript
export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    audience: process.env.AUTH0_AUDIENCE,
  }
};
```

#### 2. Nuxt Plugin (`/plugins/auth0.js`)
```javascript
import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((nuxtApp) => {
  const auth0 = createAuth0({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback'
    }
  });

  nuxtApp.vueApp.use(auth0);
});
```

#### 3. Auth Composable (`/composables/useAuth0.js`)
```javascript
import { useAuth0 as useAuth0Vue } from '@auth0/auth0-vue';

export const useAuth0 = () => {
  const auth0 = useAuth0Vue();
  
  const login = () => {
    auth0.loginWithRedirect();
  };
  
  const logout = () => {
    auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };
  
  return {
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    user: auth0.user,
    login,
    logout,
    getAccessToken: auth0.getAccessTokenSilently
  };
};
```

#### 4. Sign In Page Implementation (`/pages/index.vue`)
```vue
<template>
  <div class="signin-page">
    <div class="signin-card">
      <h1>Family Stories</h1>
      <p>Preserve your family's heritage, one story at a time</p>
      
      <button 
        @click="handleLogin" 
        :disabled="isLoading"
        class="login-button"
      >
        {{ isLoading ? 'Loading...' : 'Sign In' }}
      </button>
      
      <p class="guest-info">
        Joining a family call? No login needed - just click the link!
      </p>
    </div>
  </div>
</template>

<script setup>
const { login, isLoading, isAuthenticated } = useAuth0();
const router = useRouter();

// Redirect if already authenticated
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    router.push('/collections');
  }
});

const handleLogin = () => {
  login();
};
</script>
```

#### 5. Callback Page (`/pages/callback.vue`)
```vue
<template>
  <div class="callback-page">
    <p>Processing login...</p>
  </div>
</template>

<script setup>
const { isAuthenticated, isLoading } = useAuth0();
const router = useRouter();

watch([isAuthenticated, isLoading], ([authenticated, loading]) => {
  if (!loading && authenticated) {
    router.push('/collections');
  }
});
</script>
```

#### 6. Protected Route Middleware (`/middleware/auth.js`)
```javascript
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // Allow access to call pages (guests can join)
  if (to.path.startsWith('/call/')) {
    return;
  }
  
  // Protect other routes
  if (!isLoading.value && !isAuthenticated.value) {
    return navigateTo('/');
  }
});
```

### User Flow
1. Host visits app → Redirected to `/` (sign in page)
2. Click "Sign In" → Auth0 Universal Login opens
3. User signs in with email/social → Redirected to `/callback`
4. Callback processes auth → Redirected to `/collections`
5. Host creates call → Shares link with family
6. Guests click link → Go directly to `/call/[id]` (no auth required)

### Environment Variables
```
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CALLBACK_URL=http://localhost:3000/callback
AUTH0_AUDIENCE=your_api_audience (optional)
```

---

## Gemini AI Integration Details

### Overview
Use Google's Gemini API for all AI processing in a **single, simplified endpoint**. This reduces complexity and makes the codebase easier to understand.

### Required Package
```bash
npm install @google/generative-ai
```

### Implementation Structure

#### Single Processing Endpoint (`/api/gemini/process-story.js`)
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const { storyId, audioUrl, speakerName } = await readBody(event);
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Update status to processing
    await updateStory(storyId, { 
      processingStatus: 'processing',
      aiProcessed: false 
    });
    
    // Step 1: Transcribe audio (placeholder - may need Whisper API)
    // For MVP, you can use a separate transcription service or skip this
    const transcript = await transcribeAudio(audioUrl);
    
    // Step 2: Generate everything in parallel for speed
    const [summaryResult, titleResult, tagsResult] = await Promise.all([
      // Generate summary
      model.generateContent(`
        Summarize this family story in 2-3 paragraphs.
        Focus on key events and emotional moments.
        
        Story by ${speakerName}:
        ${transcript}
      `),
      
      // Generate title
      model.generateContent(`
        Create a 5-8 word title for this story.
        Return only the title.
        
        ${transcript.substring(0, 500)}
      `),
      
      // Extract tags
      model.generateContent(`
        Extract 3-5 thematic tags like "Immigration", "Childhood", "War", etc.
        Return only comma-separated tags.
        
        ${transcript.substring(0, 1000)}
      `)
    ]);
    
    // Extract results
    const summary = summaryResult.response.text();
    const title = titleResult.response.text().trim();
    const tags = tagsResult.response.text().split(',').map(t => t.trim());
    
    // Update story with all AI content
    await updateStory(storyId, {
      transcript,
      summary,
      title,
      tags,
      aiProcessed: true,
      processingStatus: 'complete'
    });
    
    return { success: true, storyId };
    
  } catch (error) {
    console.error('AI processing failed:', error);
    await updateStory(storyId, { processingStatus: 'failed' });
    throw error;
  }
});

// Helper function - implement based on your transcription solution
async function transcribeAudio(audioUrl) {
  // Option 1: Use Gemini's audio capabilities (if available)
  // Option 2: Use OpenAI Whisper API
  // Option 3: Use another transcription service
  // For MVP, this could even return placeholder text
  return "Placeholder transcript - implement actual transcription";
}

// Helper to update story in Firebase
async function updateStory(storyId, data) {
  // Firebase update logic
}
```

#### Frontend Composable (`/composables/useGemini.js`)
```javascript
export const useGemini = () => {
  const isProcessing = ref(false);
  const processingError = ref(null);
  
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
```

#### Simple Processing Indicator (`/components/ProcessingIndicator.vue`)
```vue
<template>
  <div v-if="show" class="processing-indicator">
    <span class="spinner">✨</span>
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: {
    type: String,
    default: 'AI is processing your story...'
  }
});
</script>

<style scoped>
.spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

### Usage in Call End Flow
```javascript
// When host ends call
async function handleEndCall() {
  // 1. Stop recording
  // 2. Upload to Firebase
  // 3. Trigger AI processing
  await $fetch('/api/gemini/process-story', {
    method: 'POST',
    body: {
      storyId: currentStoryId,
      audioUrl: uploadedAudioUrl,
      speakerName: selectedSpeaker
    }
  });
}
```

### Notes
- **Keep it simple**: One endpoint does everything
- **Transcription**: May need separate service (Whisper API recommended)
- **Error handling**: Store partial results if processing fails mid-way
- **Rate limiting**: Gemini has limits - implement basic retry logic

---

## Solana NFT Integration Details (OPTIONAL - Can Skip for MVP)

### Overview
Mint family stories as NFTs on Solana for permanent preservation. **This feature is optional and can be skipped if you're focused on core functionality.**

### Implementation Note
If you choose to implement this, keep it very simple:
- Single "Mint as NFT" button on story detail page
- Basic NFT minting to Solana devnet
- Display NFT address after minting
- No complex metadata, no IPFS upload, just basic minting

### Simplified Mint Endpoint (`/api/solana/mint-nft.js`)
```javascript
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';

export default defineEventHandler(async (event) => {
  const { storyId, title } = await readBody(event);
  
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(getWalletKeypair()));
    
    // Minimal NFT minting
    const { nft } = await metaplex.nfts().create({
      name: title,
      symbol: 'STORY',
      uri: `https://yourapp.com/stories/${storyId}`, // Simple URI
      sellerFeeBasisPoints: 0
    });
    
    // Save NFT address to Firebase
    await updateStory(storyId, {
      nftMinted: true,
      nftAddress: nft.address.toString(),
      mintedAt: new Date()
    });
    
    return {
      success: true,
      nftAddress: nft.address.toString()
    };
  } catch (error) {
    console.error('NFT minting failed:', error);
    throw error;
  }
});
```

**If this is too complex, skip it entirely for the MVP.**

---

### 2. Collections Page (`/collections`)

#### Layout & Components

**SIMPLIFIED COLLECTIONS PAGE**

**Top Navigation Bar**
- App logo (left, clickable to return here)
- User profile dropdown (right):
  - Display name/email
  - "Sign Out" button (calls Auth0 logout)
- **Search bar removed for MVP** - Keep it simple

**Hero Section / Action Area**
- Large "Start New Call" button with video icon
  - Prominent placement, primary color
  - Click creates call and shows invite link modal

**Family Members Grid**

*Each Family Member Card contains:*
- Profile photo (circular) or default avatar with initials
- Name (large, bold)
- Stories count: "X stories"
- "View Stories" button
- Click card to see that person's stories

*Grid Layout:*
- 3-4 cards per row on desktop/laptop
- Simple grid, no fancy animations
- Cards have subtle shadow

**Empty State** (when no stories exist yet)
- Simple icon
- "No stories yet"
- "Start your first call to begin collecting family memories"
- "Start New Call" button

#### Functionality
- Fetch family members and stories from Firebase
- Click family member card → navigate to filtered view showing their stories
- Click "Start New Call" → create call and show shareable link
- **That's it** - No filters, no sorting, no search for MVP

#### Additional Features - REMOVED FOR MVP
- ❌ Filter buttons
- ❌ Sort dropdown
- ❌ View toggle (grid/list)
- ❌ Search bar
- ❌ Recent calls section
- ❌ Add family member manually

---

### 3. Video Call Page (`/call/[id]`)

**IMPORTANT: Two Different Views Based on User Type**

#### Guest View (Family Members Joining via Link)
**Simple, Clean Interface - NO LOGIN REQUIRED**

**Layout:**
- **Full-screen video grid ONLY** - No sidebars, no clutter
- **Participant videos in grid format:**
  - Equal-size video tiles for all participants
  - Name labels below each video
  - Maximum 4-6 participants visible at once
  
**Minimal Controls (Bottom overlay only):**
- Microphone toggle (mute/unmute)
- Camera toggle (on/off)
- "Leave Call" button
- **That's it** - No other controls or options for guests

**Pre-Join Screen for Guests:**
- Camera/microphone preview
- "Enter your name" input field
- "Join Call" button
- Audio/video permission requests
- No account creation, no email required

**Guest Experience Flow:**
1. Click link → Goes directly to pre-join screen
2. Enter name → Test camera/mic
3. Click "Join Call" → Immediately in call with video
4. See all participants' videos
5. Basic mute/camera/leave controls only

---

#### Host View (Person Who Created the Call)
**Full-Featured Interface for Managing Recording**

**Layout & Components:**

**Main Video Grid** (takes up most of screen)
- Equal-size grid view for all participants
- Participant names displayed below each video
- Recording indicator (red dot + "Recording") at top

**Bottom Control Panel**
- Microphone button (mute/unmute)
- Camera button (on/off)
- **"Who's Talking?" Dropdown** - LARGE, PROMINENT
  - Lists all participant names
  - Host selects current speaker
  - Timestamps automatically when changed
- "Copy Invite Link" button
- "End Call" button (red, prominent)

**NO complex features like:**
- ❌ Side panels or notes
- ❌ Active speaker detection
- ❌ Screen sharing
- ❌ Chat
- ❌ Settings menu
- ❌ Participant management
- ❌ Call timer

**Host Experience Flow:**
1. Sign in with Auth0 → Go to collections
2. Click "Start New Call" → Call is created, link is displayed
3. Copy link and share with family
4. Recording starts automatically when first guest joins
5. Select who's talking from dropdown as conversation flows
6. Click "End Call" when done
7. AI processes the recording automatically

#### Functionality
- WebRTC connection for real-time video/audio
- MediaRecorder API for local recording (host only)
- **Automatic detection of host vs guest** based on authentication status
- Different UI rendered for host vs guest
- Speaker selection immediately timestamps and associates recording segments (host only)
- Auto-save speaker segments to Firebase during call (host only)
- Recording indicator always visible when active (host only)
- Invite link generates unique call ID
- **Guest participants join INSTANTLY without any signup/login**
- Handle participant join/leave events
- Network quality indicator (optional)
- Reconnection logic if connection drops
- Call timer visible to host only

#### Technical Requirements
- Use WebRTC with STUN/TURN servers
- Consider using daily.co, Agora, or Twilio SDK for easier implementation
- Record each speaker segment separately if possible
- Upload recording chunks to Firebase Storage during call (background)
- Store speaker timestamps in Firestore in real-time
- Handle browser permissions for camera/microphone

#### Design Notes
- **Guest view: Ultra-minimal** - Just video grid + 3 buttons (mute, camera, leave)
- **Host view: Simple but functional** - Add speaker selector and recording controls
- Dark theme for video call interface (reduces eye strain)
- High contrast controls for visibility
- Large, clearly labeled buttons
- **Optimized for laptop/desktop screens (1366x768 and above)**
- Mobile optimization is not a priority for MVP
- Accessibility: keyboard shortcuts (M for mute, V for video, etc.)

---

### 4. Story Detail Page (`/stories/[id]`)

#### Layout & Components

**SIMPLIFIED STORY VIEW**

**Header Section**
- Back button: "← Back to Collections"
- Story title (AI-generated, large and bold)
- Story metadata:
  - Date recorded
  - Duration
  - Speaker name

**Media Player Section**
- Basic video player with standard controls
- Play/pause, progress bar, volume
- **That's it** - no fancy features

**Story Summary Section**
- AI-generated summary (2-3 paragraphs)
- AI-generated tags displayed as simple pills/chips

**Transcript Section** (collapsed by default)
- "Show Transcript" button
- When expanded: scrollable text with speaker labels
- Timestamps every 30-60 seconds

**Actions Section**
- **"Mint as NFT" button** (Solana integration)
- Delete story button (with confirmation)

**Features REMOVED for MVP:**
- ❌ Edit title
- ❌ Regenerate summary
- ❌ Interactive transcript (click to jump)
- ❌ Edit transcript
- ❌ Add/edit tags
- ❌ Personal notes section
- ❌ Related stories
- ❌ Share story
- ❌ Add to favorites
- ❌ Download options
- ❌ Quick facts section
- ❌ Playback speed options

#### Functionality
- Fetch story data from Firebase by storyId
- Stream video/audio from Firebase Storage
- Display AI-generated content (summary, title, tags)
- Basic video playback
- Mint NFT functionality

#### Design Notes
- Clean, readable typography
- Simple layout, no clutter
- **Desktop/laptop-first design (1366x768 minimum resolution)**
- Print-friendly version for transcript (future feature)

---

### 5. Collections Detail Page (`/collections/[memberId]`) - SIMPLIFIED

#### Layout & Components

**Header Section**
- Back button: "← All Collections"
- Family member name (large)
- Stories count: "X stories"

**Stories List**
- Simple list of story cards for this family member
- Each card shows:
  - Title
  - Date
  - Duration
  - Thumbnail (if available)
  - "View Story" button

#### Functionality
- Fetch all stories where speakerName matches family member
- Click story card → navigate to story detail page

**Features REMOVED for MVP:**
- ❌ Timeline view
- ❌ Profile photo/editing
- ❌ Statistics
- ❌ Date range filters
- ❌ Search within person's stories
- ❌ Sort options
- ❌ Grid/list view toggle
- ❌ Delete family member option

---

## Backend Structure (Bones Only)

### Firebase Collections Schema

```javascript
// users collection
{
  uid: string,
  email: string,
  displayName: string,
  auth0Id: string, // Auth0 user ID
  createdAt: timestamp
}

// calls collection
{
  callId: string,
  hostId: string,
  participants: [{ name, joinedAt }],
  startTime: timestamp,
  endTime: timestamp,
  status: 'active' | 'ended',
  recordingUrl: string // Firebase Storage URL
}

// stories collection
{
  storyId: string,
  callId: string,
  speakerName: string,
  title: string, // AI-generated by Gemini
  summary: string, // AI-generated by Gemini
  transcript: string, // AI-generated by Gemini (Whisper via Gemini)
  audioUrl: string,
  videoUrl: string,
  timestamp: timestamp,
  duration: number,
  tags: string[], // AI-generated by Gemini
  
  // Gemini AI metadata
  aiProcessed: boolean,
  processingStatus: 'pending' | 'processing' | 'complete' | 'failed',
  
  // Solana NFT metadata (optional)
  nftMinted: boolean,
  nftAddress: string, // Solana NFT public key
  mintedAt: timestamp
}

// familyMembers collection (simplified)
{
  memberId: string,
  userId: string, // owner
  name: string,
  storiesCount: number
}
```

### API Routes (Nuxt Server Routes)

Create placeholder API routes in `/server/api/`:

1. `/api/call/create` - Initialize new call session
2. `/api/call/join/[id]` - Join existing call
3. `/api/call/end` - End call and trigger AI processing
4. `/api/stories/process` - Process story with Gemini AI (transcription, summarization, tagging)
5. `/api/stories/list` - Fetch stories by family member
6. `/api/gemini/transcribe` - Transcribe audio using Gemini
7. `/api/gemini/summarize` - Generate story summary
8. `/api/gemini/generate-title` - Generate story title
9. `/api/gemini/extract-tags` - Extract thematic tags
10. `/api/solana/mint-nft` - Mint story as NFT on Solana
11. `/api/solana/get-nft` - Fetch NFT metadata from Solana

---

## Implementation Priorities

### Phase 1: Core Structure (Build This First)
1. Set up Nuxt 3 project with Tailwind
2. Create all pages with static layouts (no functionality)
3. Set up Auth0 integration
4. Set up Firebase config
5. Create basic authentication flow (host login only)

### Phase 2: Video Calling (SIMPLIFIED)
1. Integrate WebRTC for basic video (recommend using daily.co for simplicity)
2. Implement call creation and join-via-link flow
3. Build separate guest and host views
4. Add basic recording functionality (host only)
5. Store recordings to Firebase Storage

### Phase 3: Story Management (MINIMAL)
1. Create "Who's talking?" dropdown that timestamps current speaker
2. Store speaker segments during call
3. Display stories on Collections page
4. Basic story playback on detail page

### Phase 4: AI Integration with Gemini (SIMPLIFIED)
1. Set up Gemini API integration
2. Create single processing endpoint that handles:
   - Audio transcription
   - Story summarization
   - Title generation
   - Tag extraction
3. Add simple processing status indicator in UI

### Phase 5: Solana NFT Integration (OPTIONAL - Can be skipped for MVP)
1. Set up Solana configuration
2. Implement basic NFT minting
3. Add "Mint as NFT" button
4. Display NFT status on stories

---

## Code Style Requirements

- **Keep it simple**: Avoid over-engineering, no complex patterns
- **Comment generously**: Explain what each component does at the top of the file
- **Use composition API**: Vue 3 script setup syntax
- **Modular components**: Small, single-purpose components with clear names
- **Clear naming conventions**: 
  - Components: `DescriptiveNameComponent.vue` (e.g., `MuteButton.vue`, `VideoGrid.vue`)
  - Composables: `useFeatureName.js` (e.g., `useWebRTC.js`, `useRecording.js`)
  - Props: Descriptive names (e.g., `isRecording`, `participantName`, not `rec`, `name`)
- **Minimal dependencies**: Only add what's necessary
- **No abstractions**: Write straightforward code, avoid clever tricks
- **Component structure**: Each Vue component should have clear sections:
  ```vue
  <template>
    <!-- Simple, semantic HTML -->
  </template>
  
  <script setup>
  // Imports
  // Props
  // Composables
  // Reactive state
  // Functions
  // Lifecycle hooks (if needed)
  </script>
  
  <style scoped>
  /* Minimal, clear styles */
  </style>
  ```

---

## File Structure

```
/
├── pages/
│   ├── index.vue (Auth0 Sign in - HOST ONLY)
│   ├── collections.vue (HOST ONLY - Simplified)
│   ├── collections/[memberId].vue (HOST ONLY - Simplified)
│   ├── call/[id].vue (BOTH - renders GuestCallView or HostCallView)
│   └── stories/[id].vue (HOST ONLY - Simplified)
├── components/
│   ├── call/
│   │   ├── GuestCallView.vue (Minimal: video grid + 3 buttons)
│   │   ├── HostCallView.vue (Video grid + speaker selector + controls)
│   │   ├── VideoGrid.vue (Shared video grid)
│   │   ├── VideoTile.vue (Single video)
│   │   ├── MuteButton.vue
│   │   ├── CameraButton.vue
│   │   ├── LeaveCallButton.vue
│   │   ├── SpeakerSelector.vue (Host only)
│   │   ├── RecordingIndicator.vue (Host only)
│   │   └── CopyLinkButton.vue (Host only)
│   ├── collections/
│   │   ├── FamilyMemberCard.vue
│   │   └── StoryCard.vue
│   ├── story/
│   │   ├── StoryHeader.vue
│   │   ├── VideoPlayer.vue
│   │   ├── StorySummary.vue
│   │   └── StoryTranscript.vue
│   ├── ProcessingIndicator.vue (Simple AI processing status)
│   └── MintNftButton.vue (Optional)
├── composables/
│   ├── useAuth0.js (Auth0 integration)
│   ├── useFirebase.js
│   ├── useWebRTC.js
│   ├── useRecording.js (Host only)
│   ├── useGemini.js (Simplified)
│   └── useSolana.js (Optional)
├── server/
│   └── api/
│       ├── call/
│       │   ├── create.js
│       │   ├── join/[id].js
│       │   └── end.js
│       ├── stories/
│       │   └── list.js
│       ├── gemini/
│       │   └── process-story.js (All-in-one processing)
│       └── solana/
│           └── mint-nft.js (Optional)
├── utils/
│   ├── auth0-config.js
│   ├── solana-config.js (Optional)
│   └── gemini-config.js
├── firebase.config.js
└── README.md
```

---

## Deliverables

**MINIMUM VIABLE PRODUCT - Keep it Simple:**

1. ✅ Auth0 login for hosts (single button)
2. ✅ Video calling with **ultra-simple** guest experience (no login)
3. ✅ Recording functionality (host side only)
4. ✅ Manual speaker tagging via dropdown (host only)
5. ✅ Storage of recordings in Firebase
6. ✅ **Simplified Gemini AI integration:**
   - Single API endpoint for all processing
   - Basic transcription, summary, title, tags
7. ✅ Basic collections page showing stories by family member
8. ✅ Simplified story detail page with playback
9. ✅ **README.md** with setup instructions

**Optional (if time permits):**
- Solana NFT minting functionality

---

## Non-Goals (Skip These for MVP)

**DO NOT BUILD THESE - They add complexity without value for MVP:**

- ❌ Real-time AI transcription during call
- ❌ Complex video editing features
- ❌ Mobile app version
- ❌ Payment/subscription system
- ❌ Advanced search/filtering/sorting
- ❌ Social sharing features
- ❌ Chat functionality in video calls
- ❌ Screen sharing
- ❌ Virtual backgrounds or filters
- ❌ Reactions/emojis
- ❌ Complex user profiles
- ❌ Email notifications
- ❌ Calendar integration
- ❌ Recording settings/options menu
- ❌ Multiple simultaneous calls
- ❌ Call history with detailed analytics
- ❌ Active speaker detection
- ❌ Side panels/notes during call
- ❌ Edit features (title, transcript, tags, notes)
- ❌ Add/edit family member profiles manually
- ❌ Relationship labels for family members
- ❌ Export features
- ❌ Download options
- ❌ Regenerate AI content
- ❌ Interactive transcripts
- ❌ Related stories
- ❌ Favorites/bookmarks
- ❌ Multiple view modes (grid/list)
- ❌ Timeline views
- ❌ Statistics dashboards

---

## Success Criteria

**MUST HAVES:**
✅ **Guest users can join calls with ZERO friction** - Click link → Enter name → Join call (no signup)
✅ **Guest view is ultra-simple** - Just video grid + 3 buttons (mute, camera, leave)
✅ Host can login with Auth0 (single button)
✅ Host can start a video call and get shareable link
✅ Call is recorded automatically (host side only)
✅ Host can select who's speaking via dropdown
✅ Recordings are saved to Firebase
✅ **Gemini AI processes recordings** (single API call does everything)
✅ Host can view collection of family stories
✅ **All Vue components have clear, descriptive names**
✅ **Code is minimal, simple, and well-commented**

**NICE TO HAVE (Optional):**
- Solana NFT minting
- NFT status display

---

## Additional Notes for AI Implementation

When you build this application:

1. **Start with the skeleton**: Create all pages with placeholder content first
2. **Implement features incrementally**: Get one feature fully working before moving to the next
3. **Use mock data initially**: Don't wait for backend - use mock data to build UI first
4. **Comment your code**: Especially around WebRTC and Firebase interactions
5. **Handle errors gracefully**: Show user-friendly error messages
6. **Think mobile-first**: Design should work on phones/tablets
7. **Keep it accessible**: Use semantic HTML, ARIA labels, keyboard navigation
8. **Test in multiple browsers**: WebRTC can behave differently across browsers

---

## Setup Instructions Template

Include in your README.md:

```markdown
# Family Stories - Setup Instructions

## Prerequisites
- Node.js 18+ 
- Firebase account
- (Optional) daily.co account for easier WebRTC

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Add your Firebase credentials to `.env`
5. Run development server: `npm run dev`

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password and Anonymous)
3. Create Firestore database
4. Enable Firebase Storage
5. Copy configuration to `.env`

## Environment Variables

```
# Firebase Configuration
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Solana Configuration (OPTIONAL - only if implementing NFTs)
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WALLET_SECRET_KEY=[your,wallet,secret,key,array]

# Optional: WebRTC Service (if using daily.co, Agora, etc.)
DAILY_API_KEY=
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

See file structure section above.

## Key Dependencies

```json
{
  "dependencies": {
    "@auth0/auth0-vue": "^2.3.0",
    "@google/generative-ai": "^0.1.0",
    "firebase": "^10.7.0",
    "vue": "^3.3.0",
    "nuxt": "^3.8.0",
    
    // Optional - only if implementing Solana NFTs
    "@solana/web3.js": "^1.87.0",
    "@metaplex-foundation/js": "^0.19.0"
  }
}
```
```

---

## Final Notes

This prompt provides comprehensive detail for building the MVP. Focus on getting the core video calling and storage features working first. AI features can be added in Phase 4 after the hackathon if time permits. The goal is a functional prototype that demonstrates the concept clearly.

Good luck with your hackathon! 🚀
