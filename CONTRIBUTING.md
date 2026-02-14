# Contributing to Family Stories

Thank you for your interest in contributing to Family Stories! This document provides guidelines and information for developers who want to contribute to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Areas for Contribution](#areas-for-contribution)

---

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

---

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/family-stories.git
   cd family-stories
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** (see README.md)
5. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 💻 Development Workflow

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Testing improvements

Examples:
- `feature/real-time-transcription`
- `fix/video-not-loading`
- `docs/update-setup-guide`

### Development Process

1. **Make your changes**
2. **Test thoroughly**
3. **Commit with clear messages**
4. **Push to your fork**
5. **Create a pull request**

---

## 🎨 Code Style Guide

### General Principles

1. **Clarity over cleverness**: Write code that's easy to understand
2. **Single responsibility**: Each function/component does one thing well
3. **Descriptive naming**: Use clear, descriptive names
4. **Comment generously**: Explain the "why", not just the "what"

### Vue Component Structure

```vue
<template>
  <!-- Simple, semantic HTML -->
  <!-- Use Tailwind classes for styling -->
</template>

<script setup>
// 1. Imports (organized: Vue, composables, components, utils)
import { ref, computed, onMounted } from 'vue';
import { useFirebase } from '~/composables/useFirebase';

// 2. Props
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// 3. Emits
const emit = defineEmits(['update', 'delete']);

// 4. Composables
const { getData } = useFirebase();

// 5. Reactive state
const loading = ref(false);
const items = ref([]);

// 6. Computed properties
const filteredItems = computed(() => {
  // computation logic
});

// 7. Functions
const handleUpdate = () => {
  // function logic
};

// 8. Lifecycle hooks
onMounted(async () => {
  // initialization logic
});
</script>

<style scoped>
/* Minimal custom styles - prefer Tailwind */
</style>
```

### JavaScript/TypeScript

```javascript
// Use camelCase for variables and functions
const userName = 'John';
const getUserData = () => { };

// Use PascalCase for components
const UserProfile = () => { };

// Use UPPER_CASE for constants
const MAX_FILE_SIZE = 5000000;

// Destructure when possible
const { name, email } = user;

// Use arrow functions
const multiply = (a, b) => a * b;

// Use async/await over promises
const fetchData = async () => {
  try {
    const data = await api.get('/data');
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Tailwind CSS

```vue
<!-- Prefer Tailwind utility classes -->
<div class="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
  <span class="text-gray-700 font-semibold">Hello</span>
</div>

<!-- Use custom classes in main.css for repeated patterns -->
<button class="btn-primary">Click me</button>
```

---

## 🧩 Component Guidelines

### Component Naming

- **Descriptive names**: `VideoTile.vue`, not `Tile.vue`
- **PascalCase**: All component files use PascalCase
- **Single-word prefixes for related components**:
  - `CallGuestView.vue`
  - `CallHostView.vue`
  - `CallVideoGrid.vue`

### Component Organization

```
components/
├── call/           # Call-related components
├── collections/    # Collections-related components
├── story/          # Story-related components
└── shared/         # Shared/common components
```

### Props

```vue
<script setup>
// Always define prop types
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  items: {
    type: Array,
    default: () => []
  }
});
</script>
```

### Events

```vue
<script setup>
// Define all emitted events
const emit = defineEmits(['update', 'delete', 'save']);

// Emit with descriptive names
const handleSave = () => {
  emit('save', { id: 123, data: 'example' });
};
</script>
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(call): add speaker auto-detection

Implemented automatic speaker detection using voice
activity detection. Updates speaker selection in real-time.

Closes #123

---

fix(video): resolve camera freeze issue

Fixed bug where camera would freeze after 5 minutes
by properly handling MediaStream lifecycle.

Fixes #456

---

docs(readme): update setup instructions

Added detailed Firebase setup steps with screenshots.
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes thoroughly**
2. **Update documentation if needed**
3. **Ensure no console errors**
4. **Check that all existing features still work**

### PR Title Format

Same as commit messages:
```
feat(component): add new feature
fix(page): resolve issue
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes:
1. Step one
2. Step two
3. Step three

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested locally
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Host can sign in with Auth0
- [ ] Host can create a call
- [ ] Guest can join with just a name
- [ ] Video/audio works for both
- [ ] Recording starts and stops properly
- [ ] Speaker selection works
- [ ] Stories are saved correctly
- [ ] Collections page loads
- [ ] Story detail page displays correctly
- [ ] No console errors

### Browser Testing

Test in:
- Chrome (primary)
- Firefox
- Safari
- Edge

---

## 🎯 Areas for Contribution

### High Priority

1. **Real WebRTC Implementation**
   - Signaling server setup
   - Peer-to-peer connections
   - Multiple participant support

2. **Audio Transcription**
   - Integrate Whisper API
   - Real-time transcription
   - Timestamp synchronization

3. **Mobile Responsiveness**
   - Mobile-optimized layouts
   - Touch controls
   - Mobile browser compatibility

### Medium Priority

4. **Search & Filtering**
   - Search across transcripts
   - Advanced filtering options
   - Tag-based search

5. **Export Features**
   - PDF export
   - eBook generation
   - Video download

6. **Notifications**
   - Email notifications
   - In-app notifications
   - Reminder system

### Low Priority

7. **Solana NFT Implementation**
   - Complete Metaplex integration
   - IPFS storage
   - Wallet connection

8. **Enhanced AI**
   - Sentiment analysis
   - Topic extraction
   - Story clustering

---

## 📚 Helpful Resources

### Documentation
- [Vue 3 Docs](https://vuejs.org/)
- [Nuxt 3 Docs](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Auth0 Docs](https://auth0.com/docs)

### Learning
- [WebRTC Tutorial](https://webrtc.org/getting-started/overview)
- [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤔 Questions?

- Check existing issues
- Review documentation
- Ask in discussions
- Contact maintainers

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Family Stories! 🎉**
