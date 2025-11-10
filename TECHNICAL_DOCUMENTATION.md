# Mandarin Pronunciation Tool - Technical Documentation

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────┐
│          User Interface Layer               │
│  (HTML5 + CSS3 + Vanilla JavaScript)        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Application Logic Layer             │
│  - Audio Recording (MediaRecorder API)      │
│  - Data Management (LocalStorage)           │
│  - Score Calculation                        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          External Services Layer            │
│  - Claude AI API (Anthropic)                │
│  - Browser APIs (MediaDevices, AudioContext)│
└─────────────────────────────────────────────┘
```

## 📦 Key Technologies

### Frontend
- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with animations and gradients
- **JavaScript (ES6+)**: Application logic
- **LocalStorage API**: Client-side data persistence

### Audio Processing
- **MediaRecorder API**: Audio capture
- **Web Audio API**: Audio playback and analysis
- **Blob API**: Audio data handling
- **Base64 Encoding**: Audio storage

### AI Integration
- **Anthropic Claude API**: Natural language analysis
- **Fetch API**: HTTP requests
- **JSON**: Data interchange

## 🔧 Core Functions

### 1. Audio Recording System

```javascript
// Recording Flow
startRecording() → getUserMedia() → MediaRecorder.start() 
→ ondataavailable → onstop → Blob creation → URL.createObjectURL()
```

**Key Functions:**
- `startTeacherRecording()`: Initiates master audio recording
- `stopTeacherRecording()`: Finalizes master audio recording
- `startStudentRecording()`: Initiates student audio recording
- `stopStudentRecording()`: Finalizes student audio recording

**Audio Format:**
- Type: `audio/wav`
- Storage: Base64 encoded strings
- Playback: HTML5 Audio element

### 2. Data Management

```javascript
// Data Structure
{
  lessons: [
    {
      id: timestamp,
      title: string,
      type: 'sentence' | 'word' | 'vowel',
      text: string,
      audioData: base64String,
      createdAt: ISO8601String
    }
  ],
  practiceHistory: [
    {
      lessonId: number,
      lessonTitle: string,
      score: number (0-100),
      timestamp: ISO8601String
    }
  ]
}
```

**Storage Keys:**
- `mandarinLessons`: Array of lesson objects
- `practiceHistory`: Array of practice session records

**Key Functions:**
- `saveLesson()`: Persists new lesson to localStorage
- `loadLessons()`: Retrieves and displays lessons
- `savePracticeSession()`: Records practice attempt
- `updateDashboard()`: Refreshes statistics

### 3. Scoring Algorithm

```javascript
function calculatePronunciationScore() {
  // Current Implementation: Simulated scoring
  // Production Implementation would include:
  
  // 1. Audio Feature Extraction
  const features = extractAudioFeatures(studentAudio, masterAudio);
  
  // 2. Feature Comparison
  const similarities = {
    pitch: comparePitch(features),
    tone: compareTone(features),
    duration: compareDuration(features),
    intensity: compareIntensity(features)
  };
  
  // 3. Weighted Score Calculation
  const score = (
    similarities.pitch * 0.3 +
    similarities.tone * 0.4 +  // Tones most important in Mandarin
    similarities.duration * 0.15 +
    similarities.intensity * 0.15
  );
  
  return Math.round(score * 100);
}
```

**Scoring Components:**
- **Tone Accuracy (40%)**: Critical for Mandarin
- **Pitch Matching (30%)**: Overall pitch similarity
- **Duration (15%)**: Timing and rhythm
- **Intensity (15%)**: Volume and emphasis

### 4. AI Integration

```javascript
// Claude API Request Structure
{
  method: "POST",
  endpoint: "https://api.anthropic.com/v1/messages",
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  }
}
```

**AI Prompt Template:**
```
Analyze this Mandarin pronunciation practice session:

Lesson: [lesson.title]
Text: [lesson.text]
Type: [lesson.type]
Student Score: [score]/100

Provide detailed, constructive feedback in the following format:
1. Overall Assessment
2. Strengths
3. Areas for Improvement
4. Specific Pronunciation Tips
5. Practice Recommendations
```

## 🎨 UI Components

### Mode Switching
- Teacher Mode: Lesson creation interface
- Student Mode: Practice and analysis interface
- Toggle buttons with visual feedback

### Recording Interface
- Start/Stop buttons with state management
- Real-time recording indicator
- Audio preview players
- Visual feedback for recording state

### Results Display
- Animated score display
- Progress bar with gradient fill
- AI feedback sections
- Detailed metrics breakdown

### Dashboard
- Statistics cards (Total Attempts, Avg Score, Best Score)
- Practice history list
- Responsive grid layout

## 🔌 API Integration Details

### Claude AI Configuration

**Required Setup:**
- API endpoint embedded in code
- No API key needed (backend handles authentication)
- Automatic error handling with fallback

**Request Parameters:**
- `model`: "claude-sonnet-4-20250514" (latest Sonnet model)
- `max_tokens`: 1500 (sufficient for detailed feedback)
- `temperature`: Default (balanced creativity/accuracy)

**Response Handling:**
```javascript
// Success Path
response.json() → data.content[0].text → formatFeedback() → display

// Error Path
catch(error) → getFallbackFeedback() → display
```

## 💾 Data Persistence

### LocalStorage Schema

```javascript
// Lessons Storage
localStorage.setItem('mandarinLessons', JSON.stringify(lessons));

// Practice History Storage
localStorage.setItem('practiceHistory', JSON.stringify(history));
```

**Capacity:**
- LocalStorage limit: ~5-10MB per domain
- Average lesson size: ~100KB (with audio)
- Estimated capacity: 50-100 lessons

**Data Export/Import (Future Enhancement):**
```javascript
// Export
function exportData() {
  const data = {
    lessons: JSON.parse(localStorage.getItem('mandarinLessons')),
    history: JSON.parse(localStorage.getItem('practiceHistory'))
  };
  return JSON.stringify(data);
}

// Import
function importData(jsonString) {
  const data = JSON.parse(jsonString);
  localStorage.setItem('mandarinLessons', JSON.stringify(data.lessons));
  localStorage.setItem('practiceHistory', JSON.stringify(data.history));
}
```

## 🧪 Testing Recommendations

### Unit Tests
```javascript
// Example test cases
describe('Scoring Algorithm', () => {
  test('returns score between 0-100', () => {
    const score = calculatePronunciationScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('Audio Recording', () => {
  test('creates valid audio blob', async () => {
    const blob = await recordAudio();
    expect(blob.type).toBe('audio/wav');
  });
});
```

### Integration Tests
- Test full recording → analysis → feedback flow
- Verify localStorage persistence
- Test mode switching
- Validate API error handling

### Browser Compatibility Tests
- Chrome (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

## 🚀 Deployment Options

### Option 1: Static Hosting
- Upload HTML file to web server
- No backend required
- Free hosting options: GitHub Pages, Netlify, Vercel

### Option 2: LMS Integration
- Embed in learning management system
- SCORM package for compatibility
- Single Sign-On integration

### Option 3: Electron App
- Desktop application packaging
- Offline functionality
- Native OS integration

## 🔒 Security Considerations

### Current Implementation
- Client-side only (no server attacks)
- No user authentication (no credential theft)
- Local data storage (privacy by design)

### Recommendations
- Implement Content Security Policy (CSP)
- Validate all user inputs
- Sanitize audio data before storage
- Rate limit API requests

### Privacy
- No data leaves device (except AI analysis)
- Audio files not uploaded to servers
- No tracking or analytics
- GDPR compliant by design

## 📈 Performance Optimization

### Current Optimizations
- Lazy loading of audio
- Efficient DOM manipulation
- CSS animations (GPU accelerated)
- Minimal external dependencies

### Future Optimizations
```javascript
// Audio compression
function compressAudio(audioBlob) {
  // Use Opus codec for better compression
  // Target: 64kbps bitrate
  // Expected size reduction: 70-80%
}

// Lazy loading lessons
function loadLessonsOnDemand() {
  // Only load visible lessons
  // Implement virtual scrolling
  // Reduce initial load time
}

// Web Worker for analysis
const analysisWorker = new Worker('analysis-worker.js');
// Offload heavy computation to background thread
```

## 🔧 Customization Guide

### Adding New Lesson Types

```javascript
// 1. Update lesson type options
<select id="lesson-type">
  <option value="sentence">Sentence</option>
  <option value="word">Word</option>
  <option value="vowel">Vowel/Sound</option>
  <option value="phrase">Phrase</option> <!-- NEW -->
  <option value="dialogue">Dialogue</option> <!-- NEW -->
</select>

// 2. Update AI prompt logic
function getPromptForType(type) {
  const prompts = {
    sentence: "Focus on sentence structure and flow...",
    word: "Analyze individual word pronunciation...",
    vowel: "Examine vowel sound accuracy...",
    phrase: "Evaluate phrase cohesion...", // NEW
    dialogue: "Assess conversational naturalness..." // NEW
  };
  return prompts[type];
}
```

### Customizing Scoring Weights

```javascript
// Adjust importance of different factors
const SCORING_WEIGHTS = {
  tone: 0.4,      // 40% - most important for Mandarin
  pitch: 0.3,     // 30%
  duration: 0.15, // 15%
  intensity: 0.15 // 15%
};

// For other languages, adjust accordingly
// Example for English:
// pitch: 0.3, stress: 0.3, clarity: 0.25, duration: 0.15
```

### Styling Customization

```css
/* Change color scheme */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #4CAF50;
  --danger-color: #f44336;
  --text-color: #333;
  --background-color: #ffffff;
}

/* Modify card appearance */
.card {
  border-radius: 15px; /* Adjust roundness */
  box-shadow: 0 5px 15px rgba(0,0,0,0.1); /* Adjust shadow */
}
```

## 🐛 Known Limitations

### Current Limitations
1. **Simulated Scoring**: Not using real audio analysis yet
2. **Browser-Specific**: Requires modern browser features
3. **Single Device**: No cross-device synchronization
4. **Internet Required**: For AI analysis only
5. **Storage Limited**: LocalStorage capacity constraints

### Planned Improvements
1. **Real Audio Analysis**: Implement proper DSP algorithms
2. **Cloud Sync**: Optional cloud storage for lessons
3. **Offline AI**: Local model for basic feedback
4. **Advanced Metrics**: Spectral analysis, formant tracking
5. **Multi-Language**: Support for other tonal languages

## 📚 Dependencies

### Current Dependencies
- **None**: Pure vanilla JavaScript implementation

### Optional Enhancements
```javascript
// Audio Processing
// - Web Audio API (built-in)
// - TensorFlow.js (for ML-based analysis)

// UI Enhancements
// - Chart.js (for visualizations)
// - WaveSurfer.js (for waveform display)

// Future: Advanced Audio Analysis
// - Meyda (audio feature extraction)
// - PitchFinder (pitch detection)
```

## 🤝 Contributing Guidelines

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Comment complex logic
- Keep functions small and focused

### Testing
- Write tests for new features
- Maintain >80% code coverage
- Test across multiple browsers
- Include edge cases

### Documentation
- Update README for new features
- Document API changes
- Include code examples
- Keep diagrams current

## 📞 Support & Resources

### Useful Links
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- MediaRecorder API: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
- Claude API Docs: https://docs.anthropic.com
- LocalStorage Guide: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

### Debugging Tips
```javascript
// Enable debug mode
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
}

// Usage
debugLog('Recording started', { timestamp: Date.now() });
```

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: Development Team
