# 🎓 BINUS Mandarin Teaching Portal Setup Guide

## 📋 Quick Start for Teachers

### 1. 🗄️ Database Setup (Admin Only)

**Step 1:** Create a Supabase account at [supabase.com](https://supabase.com)

**Step 2:** Create a new project and note down:
- Project URL: `https://your-project-ref.supabase.co`
- Anon Key: `your-anon-key-here`

**Step 3:** Run the SQL schema in Supabase SQL Editor:
```sql
-- Copy and paste the contents of supabase-schema.sql
-- This creates all tables: teachers, classes, lessons, students, etc.
```

**Step 4:** Update `supabase-config.js` with your credentials:
```javascript
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 2. 👨‍🏫 Teacher Registration Process

**For Teachers:**
1. Visit the Teacher Portal
2. Click "注册 Sign Up" 
3. Enter your details:
   - Full Name
   - Email address
   - Password (6+ characters)
4. Click "📝 Request Teacher Access"
5. Wait for admin approval

**For Admins:**
1. Go to Supabase Dashboard → Table Editor → teachers
2. Find pending teachers (status = 'pending')
3. Run SQL command to approve:
```sql
SELECT approve_teacher('teacher@example.com');
```

### 3. 🏫 Creating Classes

**After Approval:**
1. Login to Teacher Portal
2. Go to "🏫 My Classes" tab
3. Fill in:
   - Class Name: `Grade 7A Mandarin`
   - Class Code: `G7A-2025` (unique)
   - Description: Brief description
4. Click "➕ Create Class"

### 4. 📚 Creating Lessons

1. Go to "📝 Create Lessons" tab
2. Select target class
3. Fill lesson details:
   - Title
   - Type (sentence/word/vowel/tone)
   - Content (Mandarin text + pinyin)
   - Difficulty level
4. Record master audio
5. Assign to specific class
6. Save & Publish

### 5. 👨‍🎓 Student Access

**Students need:**
1. First name
2. Class code from teacher
3. Go to Student Interface
4. Enter details and start learning!

**Students can:**
- Practice pronunciation with AI feedback
- Access Learning Hub content
- Track progress and earn XP
- See lessons assigned to their class

## 🔧 Technical Features

### 🔐 Authentication
- Email-based teacher registration
- Admin approval workflow
- Secure session management
- Role-based access control

### 🗃️ Database Structure
- **Teachers**: Email, name, approval status
- **Classes**: Name, unique code, teacher assignment
- **Lessons**: Title, content, audio, class assignment
- **Students**: Name, class association (no login required)
- **Progress**: XP, scores, completion tracking

### 🌐 Class Management
- Teachers create classes with unique codes
- Students join using class codes
- Lessons are class-specific
- Progress tracking per class

### 📊 Data Flow
1. Teacher creates account → Admin approves
2. Teacher creates classes with unique codes
3. Teacher creates lessons assigned to classes
4. Students enter name + class code
5. Students see only their class lessons
6. Progress automatically synced to database

## 🚀 Deployment Options

### Local Development
```bash
node server.js
# Visit http://localhost:3000
```

### Vercel Deployment
1. Configure environment variables in Vercel
2. Deploy as static site with serverless functions
3. Students and teachers access via web

## 🎯 AI Responses

The system now includes fun bilingual responses:
- **Chinese + English mix**: "太棒了! Awesome!"
- **Playful emojis**: "🦄🍿🤸‍♂️"
- **Context-aware messages**: Different responses for different situations
- **Short and goofy**: Quick, memorable feedback

## 📋 Admin Tasks

### Daily Tasks:
- Approve new teacher registrations
- Monitor class creation
- Check system usage

### Maintenance:
- Backup database regularly
- Monitor storage usage
- Update AI response messages

## 🆘 Troubleshooting

**Teacher can't login:**
- Check if approved in database
- Verify email/password
- Check Supabase connection

**Student can't see lessons:**
- Verify class code exists
- Check if lessons assigned to class
- Ensure teacher created lessons

**Audio not working:**
- Check browser permissions
- Test microphone access
- Verify audio recording capability

## 🎉 Success Metrics

- Teachers approved and active
- Classes created with students
- Lessons created and practiced
- Student engagement and progress
- AI feedback utilization

---

**Ready to revolutionize Mandarin learning at BINUS! 🇨🇳✨**