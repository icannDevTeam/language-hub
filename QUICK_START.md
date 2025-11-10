# 🚀 QUICK START GUIDE

## Get Started in 3 Steps!

### Step 1: Install Dependencies
Open your terminal in the `mandarin-app` folder and run:
```bash
npm install
```

This will install Express and other required packages.

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎯 Mandarin Pronunciation Learning Tool                ║
║                                                           ║
║   Server running on: http://localhost:3000               ║
║                                                           ║
║   📚 Teacher Interface: http://localhost:3000/teacher    ║
║   👨‍🎓 Student Interface: http://localhost:3000/student    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Step 3: Open in Browser

**For Teachers:**
- Open: `http://localhost:3000/teacher`
- Create lessons and manage content

**For Students:**
- Open: `http://localhost:3000/student`
- Practice and get AI feedback

---

## 👨‍🏫 Teacher Workflow

1. Open teacher interface
2. Fill in lesson details:
   - Title: "Basic Greetings"
   - Type: Sentence/Word/Vowel
   - Text: "你好 (nǐ hǎo)"
3. Click "Start Recording" → Speak → "Stop Recording"
4. Click "Save Lesson"
5. Lesson is now available to students!

## 👨‍🎓 Student Workflow

1. Open student interface
2. Click on a lesson
3. Listen to master recording
4. Click "Start Recording" → Speak → "Stop Recording"
5. Click "Analyze My Pronunciation"
6. Get instant score and AI feedback!

---

## 🌐 Access from Other Devices (Same Network)

1. Find your computer's IP address:
   - **Windows:** Open CMD, type `ipconfig`, look for "IPv4 Address"
   - **Mac:** Open Terminal, type `ifconfig | grep inet`, look for 192.168.x.x
   - **Linux:** Open Terminal, type `ip addr show`, look for 192.168.x.x

2. On other devices, open:
   - Teacher: `http://YOUR_IP:3000/teacher`
   - Student: `http://YOUR_IP:3000/student`

Example: `http://192.168.1.100:3000/student`

---

## ⚠️ Important Notes

### Microphone Access
- Browser will ask for microphone permission
- Click "Allow" to enable recording
- Works best in Chrome, Firefox, Edge

### Data Storage
- All data stored in `data/` folder
- Automatically created on first run
- Backed up regularly if needed

### Stopping the Server
- Press `Ctrl + C` in terminal
- Data is saved automatically

---

## 🆘 Common Issues

**Issue:** Port 3000 already in use
**Solution:** 
```bash
# Stop the process or use different port
PORT=8080 npm start
```

**Issue:** Microphone not working
**Solution:**
- Check browser permissions
- Try different browser
- Ensure no other app is using microphone

**Issue:** Can't see lessons
**Solution:**
- Make sure server is running
- Refresh the page
- Check browser console (F12) for errors

---

## 📝 Development Mode

For auto-reload during development:
```bash
npm run dev
```

This will restart server automatically when you edit files.

---

## 🎯 Next Steps

1. ✅ Get the app running locally
2. ✅ Create your first lesson (teacher)
3. ✅ Try practicing (student)
4. Read full README.md for deployment options
5. Customize colors and features as needed

---

## 🔗 Important Links

- Full Documentation: `README.md`
- Teacher Interface: `/teacher`
- Student Interface: `/student`

---

**Need Help?** Check the README.md for detailed troubleshooting and configuration options!

**Ready to Deploy?** See the deployment section in README.md for production setup.
