# 🏗️ Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interfaces                         │
├──────────────────────────┬──────────────────────────────────┤
│   👨‍🏫 Teacher Interface   │   👨‍🎓 Student Interface         │
│   /teacher                │   /student                       │
│                           │                                  │
│   - Create Lessons        │   - Browse Lessons               │
│   - Record Audio          │   - Practice                     │
│   - Manage Content        │   - Get Feedback                 │
│   - View Analytics        │   - Track Progress               │
└──────────────────────────┴──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express Server                          │
│                      (server.js)                            │
│                                                             │
│   API Routes:                                               │
│   - GET  /api/lessons           (list all)                 │
│   - GET  /api/lessons/:id       (get one)                  │
│   - POST /api/lessons           (create)                   │
│   - PUT  /api/lessons/:id       (update)                   │
│   - DELETE /api/lessons/:id     (delete)                   │
│   - POST /api/practice          (save session)             │
│   - GET  /api/practice/stats    (get stats)                │
│   - POST /api/analyze           (AI feedback)              │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   File System Storage    │  │   Claude AI API          │
│   (data/ folder)         │  │   (Anthropic)            │
│                          │  │                          │
│   - lessons.json         │  │   - Analyze recording    │
│   - practice_history.json│  │   - Generate feedback    │
└──────────────────────────┘  └──────────────────────────┘
```

## Data Flow

### Teacher Creates Lesson
```
1. Teacher opens /teacher
2. Fills form (title, type, text)
3. Records audio via MediaRecorder API
4. Audio converted to Base64
5. POST /api/lessons
6. Server saves to lessons.json
7. Success message displayed
```

### Student Practices
```
1. Student opens /student
2. Selects lesson from list
3. GET /api/lessons/:id (fetch full lesson with audio)
4. Listens to master recording
5. Records own audio via MediaRecorder API
6. Clicks "Analyze"
7. Score calculated (simulated algorithm)
8. POST /api/analyze (to Claude AI)
9. AI returns detailed feedback
10. POST /api/practice (save session)
11. Results displayed with score and feedback
12. Stats updated
```

## File Structure

```
mandarin-app/
│
├── 📄 server.js                 # Express server & API routes
├── 📄 package.json              # Dependencies & scripts
├── 📄 README.md                 # Full documentation
├── 📄 QUICK_START.md            # Quick setup guide
├── 📄 .gitignore                # Git ignore rules
│
├── 📁 public/                   # Frontend files
│   ├── 📄 teacher.html          # Teacher interface
│   └── 📄 student.html          # Student interface
│
└── 📁 data/                     # Data storage (auto-created)
    ├── 📄 lessons.json          # All lessons with audio
    └── 📄 practice_history.json # Student practice records
```

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (no frameworks needed)
- **Vanilla JavaScript** - Logic and interactivity
- **MediaRecorder API** - Audio recording
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **File System (fs)** - Data storage
- **CORS** - Cross-origin support
- **Body Parser** - JSON parsing

### External Services
- **Claude AI (Anthropic)** - Pronunciation analysis and feedback

## Security Model

### Current (Development)
```
┌─────────────────────────────────────┐
│  No Authentication                  │
│  - Open access to both interfaces   │
│  - File-based storage               │
│  - Local network only               │
└─────────────────────────────────────┘
```

### Recommended (Production)
```
┌─────────────────────────────────────┐
│  Teacher Authentication             │
│  - Login required for /teacher      │
│  - JWT tokens or session-based      │
│  - Role-based access control        │
├─────────────────────────────────────┤
│  Student Authentication (Optional)  │
│  - Track individual progress        │
│  - Personal dashboards              │
├─────────────────────────────────────┤
│  Data Security                      │
│  - Database instead of JSON files   │
│  - Cloud storage for audio          │
│  - HTTPS required                   │
│  - Input validation & sanitization  │
└─────────────────────────────────────┘
```

## Separation of Concerns

### Teacher Interface (`/teacher`)
**Purpose:** Content creation and management
- Create new lessons
- Record master audio
- Edit/delete lessons
- View student statistics
- **Cannot:** Practice lessons or see student view

### Student Interface (`/student`)
- Browse available lessons
- Practice pronunciation
- Get AI feedback
- Track personal progress
- **Cannot:** Create/edit/delete lessons or access teacher tools

### Benefits of Separation:
1. ✅ **Security:** Teachers' tools not exposed to students
2. ✅ **UX:** Clean, focused interfaces for each role
3. ✅ **Simplicity:** Each user sees only what they need
4. ✅ **Scalability:** Easy to add authentication later
5. ✅ **Maintenance:** Changes to one don't affect the other

## API Security (Production Recommendations)

```javascript
// Add authentication middleware
const authenticateTeacher = (req, res, next) => {
  // Verify JWT token or session
  if (req.isAuthenticated && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
};

// Protected routes
app.post('/api/lessons', authenticateTeacher, createLesson);
app.delete('/api/lessons/:id', authenticateTeacher, deleteLesson);
```

## Scaling Considerations

### Current Capacity
- ✅ Perfect for single teacher/small classes
- ✅ ~50-100 lessons with audio
- ✅ ~1000 practice sessions

### When to Upgrade
If you need:
- Multiple teachers
- 100+ lessons
- 1000+ students
- Advanced analytics
- Real-time collaboration

### Upgrade Path
1. **Database:** MongoDB/PostgreSQL for data
2. **Cloud Storage:** AWS S3/Azure Blob for audio
3. **Authentication:** JWT or OAuth 2.0
4. **Caching:** Redis for performance
5. **CDN:** For faster audio delivery
6. **Load Balancing:** For high traffic
7. **Monitoring:** Application performance tracking

## Deployment Architecture

### Development (Current)
```
[Your Computer] → localhost:3000
```

### Local Network
```
[Teacher's Computer] ← WiFi → [Student Devices]
192.168.1.100:3000
```

### Production (Recommended)
```
[Users] → HTTPS → [Load Balancer]
                      ↓
              [Application Servers]
                      ↓
              [Database + Storage]
```

## Performance Optimization

### Current Performance
- Fast for local use
- Audio stored as Base64 (simple but larger)
- No caching
- Synchronous file operations

### Optimization Options
1. **Compress Audio:** Convert to MP3/Opus
2. **Lazy Loading:** Load lessons on demand
3. **Caching:** Cache frequently accessed data
4. **CDN:** Serve audio from edge locations
5. **Database Indexing:** For faster queries
6. **Async Operations:** Non-blocking file I/O

## Future Architecture Ideas

```
┌──────────────────────────────────────────────────────┐
│            Microservices Architecture                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Auth Service] [Lesson Service] [Analysis Service] │
│       ↓               ↓                 ↓            │
│  [API Gateway] ← → [Message Queue] ← → [Workers]    │
│       ↓                                              │
│  [Database] [Cache] [Object Storage] [Analytics]    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

**Current Status:** ✅ Fully functional for local development
**Next Step:** Add authentication for production use
**Recommended:** Start with current setup, upgrade as needed
