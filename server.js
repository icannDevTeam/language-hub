const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// Data storage (in production, use a database)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LESSONS_FILE = path.join(DATA_DIR, 'lessons.json');
const HISTORY_FILE = path.join(DATA_DIR, 'practice_history.json');

// Initialize data files
function initializeDataFiles() {
    if (!fs.existsSync(LESSONS_FILE)) {
        fs.writeFileSync(LESSONS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(HISTORY_FILE)) {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
    }
}

initializeDataFiles();

// Helper functions
function readLessons() {
    const data = fs.readFileSync(LESSONS_FILE, 'utf8');
    return JSON.parse(data);
}

function writeLessons(lessons) {
    fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2));
}

function readHistory() {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
}

function writeHistory(history) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// ===== ROUTES =====

// Root route - redirect to student interface by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Teacher interface (multiple routes for convenience)
app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher_portal.html'));
});

app.get('/teachers', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher_portal.html'));
});

app.get('/teacher-portal', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher_portal.html'));
});

// Student interface
app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'student.html'));
});

// Legacy student route (redirect to new structure)
app.get('/mandarin-tool', (req, res) => {
    res.sendFile(path.join(__dirname, 'student.html'));
});

// ===== API ENDPOINTS =====

// Get all lessons (for students)
app.get('/api/lessons', (req, res) => {
    try {
        const lessons = readLessons();
        // Don't send audio data to students initially, only lesson metadata
        const lessonMetadata = lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            text: lesson.text,
            createdAt: lesson.createdAt
        }));
        res.json(lessonMetadata);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve lessons' });
    }
});

// Get single lesson with audio (for practice)
app.get('/api/lessons/:id', (req, res) => {
    try {
        const lessons = readLessons();
        const lesson = lessons.find(l => l.id === parseInt(req.params.id));
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve lesson' });
    }
});

// Create new lesson (teacher only)
app.post('/api/lessons', (req, res) => {
    try {
        const { title, type, text, audioData } = req.body;
        
        if (!title || !type || !text || !audioData) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const lessons = readLessons();
        const newLesson = {
            id: Date.now(),
            title,
            type,
            text,
            audioData,
            createdAt: new Date().toISOString()
        };

        lessons.push(newLesson);
        writeLessons(lessons);

        res.status(201).json({ 
            message: 'Lesson created successfully',
            lesson: newLesson
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create lesson' });
    }
});

// Update lesson (teacher only)
app.put('/api/lessons/:id', (req, res) => {
    try {
        const lessons = readLessons();
        const index = lessons.findIndex(l => l.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        lessons[index] = {
            ...lessons[index],
            ...req.body,
            id: lessons[index].id, // Keep original ID
            updatedAt: new Date().toISOString()
        };

        writeLessons(lessons);
        res.json({ 
            message: 'Lesson updated successfully',
            lesson: lessons[index]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update lesson' });
    }
});

// Delete lesson (teacher only)
app.delete('/api/lessons/:id', (req, res) => {
    try {
        const lessons = readLessons();
        const filteredLessons = lessons.filter(l => l.id !== parseInt(req.params.id));
        
        if (lessons.length === filteredLessons.length) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        writeLessons(filteredLessons);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete lesson' });
    }
});

// Submit practice session
app.post('/api/practice', (req, res) => {
    try {
        const { lessonId, lessonTitle, score, studentAudio } = req.body;
        
        if (!lessonId || !lessonTitle || score === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const history = readHistory();
        const session = {
            id: Date.now(),
            lessonId,
            lessonTitle,
            score,
            timestamp: new Date().toISOString(),
            // Optionally store student audio for teacher review
            studentAudio: studentAudio || null
        };

        history.push(session);
        writeHistory(history);

        res.status(201).json({ 
            message: 'Practice session saved',
            session
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save practice session' });
    }
});

// Get practice history
app.get('/api/practice/history', (req, res) => {
    try {
        const history = readHistory();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve practice history' });
    }
});

// Get statistics
app.get('/api/practice/stats', (req, res) => {
    try {
        const history = readHistory();
        
        if (history.length === 0) {
            return res.json({
                totalAttempts: 0,
                avgScore: 0,
                bestScore: 0,
                recentSessions: []
            });
        }

        const totalAttempts = history.length;
        const avgScore = Math.round(
            history.reduce((sum, session) => sum + session.score, 0) / totalAttempts
        );
        const bestScore = Math.max(...history.map(s => s.score));
        const recentSessions = history.slice(-10).reverse();

        res.json({
            totalAttempts,
            avgScore,
            bestScore,
            recentSessions
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
});

// Claude AI Analysis endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { lessonTitle, lessonText, lessonType, score } = req.body;

        const prompt = `Analyze this Mandarin pronunciation practice session:

Lesson: ${lessonTitle}
Text: ${lessonText}
Type: ${lessonType}
Student Score: ${score}/100

Provide detailed, constructive feedback in the following format:
1. Overall Assessment (2-3 sentences)
2. Strengths (2-3 specific points)
3. Areas for Improvement (2-3 specific points with actionable advice)
4. Specific Pronunciation Tips for this ${lessonType}
5. Practice Recommendations

Be encouraging and specific. Focus on common Mandarin pronunciation challenges.`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1500,
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        const feedback = data.content[0].text;

        res.json({ feedback });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        // Return fallback feedback
        const fallbackFeedback = generateFallbackFeedback(req.body.score);
        res.json({ feedback: fallbackFeedback });
    }
});

function generateFallbackFeedback(score) {
    if (score >= 85) {
        return `**Overall Assessment:**
Excellent work! Your pronunciation demonstrates strong command of Mandarin tones and sounds.

**Strengths:**
- Clear articulation
- Good tone accuracy
- Natural rhythm

**Areas for Improvement:**
- Continue practicing to maintain this high level
- Work on subtle tone transitions

**Practice Recommendations:**
Keep up the consistent practice. Try more challenging material to further improve.`;
    } else if (score >= 70) {
        return `**Overall Assessment:**
Good effort! You're making solid progress with room for improvement.

**Strengths:**
- Decent pronunciation clarity
- Understanding of basic tones

**Areas for Improvement:**
- Focus on tone accuracy and consistency
- Work on challenging sound combinations
- Practice rhythm and pacing

**Practice Recommendations:**
Regular daily practice focusing on difficult tones and sounds will help you improve significantly.`;
    } else {
        return `**Overall Assessment:**
Keep practicing! Building good pronunciation takes time and consistent effort.

**Strengths:**
- You're making an effort to learn
- Starting to understand the basics

**Areas for Improvement:**
- Focus on mastering the four tones
- Listen carefully to the master recording
- Practice individual sounds before full sentences

**Practice Recommendations:**
Start with simpler exercises. Practice each tone separately, then combine. Listen to native speakers frequently.`;
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎯 Mandarin Pronunciation Learning Tool                ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║                                                           ║
║   📚 Teacher Interface: http://localhost:${PORT}/teacher   ║
║   👨‍🎓 Student Interface: http://localhost:${PORT}/student   ║
║                                                           ║
║   Press Ctrl+C to stop the server                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
