# Mandarin Pronunciation Learning Tool

A web-based application for Mandarin language teachers and students with AI-powered pronunciation feedback.

## 🌟 Features

### For Teachers
- **Separate Teacher Interface** - Dedicated dashboard at `/teacher`
- **Create Master Lessons** - Record audio samples for sentences, words, and vowels
- **Lesson Management** - Edit and delete lessons
- **Student Analytics** - View student practice statistics
- **Secure** - Students cannot access teacher dashboard

### For Students
- **Separate Student Interface** - Clean practice interface at `/student`
- **Browse Lessons** - View all available lessons
- **Practice Mode** - Listen to master recordings and record attempts
- **AI Feedback** - Get detailed pronunciation analysis from Claude AI
- **Score System** - Receive scores out of 100
- **Progress Tracking** - View personal statistics and history

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Modern web browser with microphone access

### Installation

1. **Navigate to the project directory:**
```bash
cd mandarin-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

4. **Configure Supabase (Required for cloud features):**
```bash
# Copy the template configuration file
cp supabase-config.template.js supabase-config.js
```

Edit `supabase-config.js` and replace the placeholder values:
- `YOUR_SUPABASE_PROJECT_URL_HERE` - Your Supabase project URL
- `YOUR_SUPABASE_ANON_KEY_HERE` - Your Supabase anonymous key

**⚠️ SECURITY NOTE:** Never commit `supabase-config.js` to version control. It's automatically excluded by `.gitignore`.

5. **Open your browser:**
- Teacher Interface: `http://localhost:3000/teacher`
- Student Interface: `http://localhost:3000/student`

## 📁 Project Structure

```
mandarin-app/
├── server.js              # Express server
├── package.json           # Dependencies
├── public/
│   ├── teacher.html       # Teacher interface
│   └── student.html       # Student interface
└── data/
    ├── lessons.json       # Lesson data (auto-created)
    └── practice_history.json  # Practice records (auto-created)
```

## 🎯 Usage Guide

### For Teachers

1. **Access Teacher Dashboard:**
   - Open `http://localhost:3000/teacher`

2. **Create a Lesson:**
   - Fill in lesson title (e.g., "Basic Greetings")
   - Select lesson type (Sentence, Word, or Vowel)
   - Enter Mandarin text and pinyin
   - Click "Start Recording" and speak clearly
   - Click "Stop Recording" when done
   - Review the audio
   - Click "Save Lesson"

3. **Manage Lessons:**
   - View all saved lessons with audio playback
   - Delete lessons if needed
   - View student practice statistics

### For Students

1. **Access Student Interface:**
   - Open `http://localhost:3000/student`

2. **Practice a Lesson:**
   - Click on any lesson from the list
   - Listen to the master recording (multiple times if needed)
   - Click "Start Recording" and speak
   - Click "Stop Recording"
   - Click "Analyze My Pronunciation"

3. **Review Results:**
   - View your score (0-100)
   - Read AI-generated feedback
   - Check detailed metrics
   - Try again or choose another lesson

4. **Track Progress:**
   - View total attempts, average score, and best score
   - Review recent practice sessions

## 🔧 Configuration

### Changing the Port

Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

Or set environment variable:
```bash
PORT=8080 npm start
```

### Data Storage

By default, data is stored in JSON files in the `data/` directory:
- `lessons.json` - All lesson data including audio
- `practice_history.json` - Student practice records

For production, consider migrating to a proper database (MongoDB, PostgreSQL, etc.)

## 🌐 Deployment

### Local Network Access

To access from other devices on your local network:

1. Find your local IP address:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
# or
ip addr show
```

2. Start the server and access from other devices:
```
http://YOUR_IP_ADDRESS:3000/teacher
http://YOUR_IP_ADDRESS:3000/student
```

### Cloud Hosting (Production)

#### Option 1: Heroku
```bash
# Install Heroku CLI
heroku create mandarin-app
git push heroku main
```

#### Option 2: DigitalOcean / AWS / Azure
- Upload files to your server
- Install Node.js and npm
- Run `npm install`
- Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

#### Option 3: Vercel / Netlify
- These platforms support Node.js apps
- Connect your GitHub repository
- Set build commands and environment variables

### Important for Production:

1. **Add Authentication**
   - Implement login system for teachers
   - Protect `/teacher` route
   - Add student accounts if needed

2. **Use a Real Database**
   - MongoDB, PostgreSQL, or MySQL
   - Store audio files in cloud storage (AWS S3, Azure Blob)

3. **Enable HTTPS**
   - Required for microphone access in production
   - Use Let's Encrypt for free SSL certificates

4. **Add Rate Limiting**
   - Protect API endpoints from abuse

## 🔒 Security Considerations

### Current Implementation
- No authentication (for local development)
- File-based storage
- Client-side audio storage

### Production Recommendations
1. Add teacher authentication (JWT, OAuth, etc.)
2. Implement student login system
3. Add CORS configuration
4. Use environment variables for sensitive data
5. Implement rate limiting
6. Add input validation and sanitization
7. Use HTTPS in production

## 🎨 Customization

### Changing Colors

Edit the CSS in `teacher.html` or `student.html`:

```css
/* Teacher theme */
background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);

/* Student theme */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding New Lesson Types

1. Update the select options in `teacher.html`:
```html
<option value="phrase">Phrase</option>
<option value="dialogue">Dialogue</option>
```

2. Update the AI prompt in `server.js` to handle new types

### Adjusting Scoring Algorithm

Edit the `calculateScore()` function in `student.html` for custom scoring logic.

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS in production (required for microphone access)
- Try a different browser

### Port Already in Use
```bash
# Find and kill the process using the port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Data Not Persisting
- Check that `data/` directory exists
- Ensure write permissions
- Check server logs for errors

### AI Feedback Not Working
- Check internet connection
- Verify Claude API is accessible
- Check server console for errors
- Fallback feedback will be used if API fails

## 📊 API Endpoints

### Lessons
- `GET /api/lessons` - Get all lessons (metadata only)
- `GET /api/lessons/:id` - Get single lesson with audio
- `POST /api/lessons` - Create new lesson (teacher)
- `PUT /api/lessons/:id` - Update lesson (teacher)
- `DELETE /api/lessons/:id` - Delete lesson (teacher)

### Practice
- `POST /api/practice` - Submit practice session
- `GET /api/practice/history` - Get practice history
- `GET /api/practice/stats` - Get statistics

### Analysis
- `POST /api/analyze` - Get AI feedback

## 🤝 Contributing

To contribute or customize:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - Feel free to use and modify for your needs.

## 🆘 Support

For issues or questions:
1. Check this README
2. Review the troubleshooting section
3. Check the browser console for errors
4. Review server logs

## 🔮 Future Enhancements

Potential features to add:
- [ ] Real audio analysis (pitch, tone detection)
- [ ] User authentication system
- [ ] Database integration
- [ ] Cloud audio storage
- [ ] Video recording support
- [ ] Multi-language support
- [ ] Gamification (badges, achievements)
- [ ] Export/import lessons
- [ ] Detailed analytics dashboard
- [ ] Mobile app version
- [ ] Offline mode
- [ ] Social features (sharing, comments)

## 📞 Technical Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Audio:** MediaRecorder API, Web Audio API
- **AI:** Claude (Anthropic API)
- **Storage:** JSON files (file system)

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Created for:** Language Teachers and Students
