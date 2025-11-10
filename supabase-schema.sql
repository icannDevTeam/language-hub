-- Supabase Database Schema for Mandarin Pronunciation Tool
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

-- Teachers table
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id)
);

-- Classes table
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sentence', 'word', 'vowel', 'tone')),
    content JSONB NOT NULL, -- Store text, pinyin, etc.
    audio_data TEXT, -- Base64 encoded audio
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (for tracking without full auth)
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    class_code TEXT NOT NULL,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student progress table
CREATE TABLE student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    score NUMERIC(5,2), -- Score percentage
    xp_earned INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Achievements table
CREATE TABLE achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_status ON teachers(status);
CREATE INDEX idx_classes_code ON classes(code);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_lessons_class ON lessons(class_id);
CREATE INDEX idx_lessons_teacher ON lessons(teacher_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_progress_student ON student_progress(student_id);
CREATE INDEX idx_progress_lesson ON student_progress(lesson_id);

-- Row Level Security Policies

-- Teachers can only see their own data when approved
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can view own profile" ON teachers
    FOR SELECT USING (auth.email() = email AND status = 'approved');

CREATE POLICY "Anyone can insert teacher registration" ON teachers
    FOR INSERT WITH CHECK (true);

-- Classes - teachers can only manage their own classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage own classes" ON classes
    FOR ALL USING (teacher_id IN (
        SELECT id FROM teachers WHERE email = auth.email() AND status = 'approved'
    ));

-- Lessons - teachers can only manage their own lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage own lessons" ON lessons
    FOR ALL USING (teacher_id IN (
        SELECT id FROM teachers WHERE email = auth.email() AND status = 'approved'
    ));

-- Students can view lessons from their class
CREATE POLICY "Students can view class lessons" ON lessons
    FOR SELECT USING (class_id IN (
        SELECT DISTINCT class_id FROM students
    ));

-- Students table - open for reading by class
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can be viewed by class" ON students
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create student profiles" ON students
    FOR INSERT WITH CHECK (true);

-- Student progress - students can manage their own progress
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage own progress" ON student_progress
    FOR ALL USING (true); -- Simplified for demo

-- Achievements - students can view their own
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create achievements" ON achievements
    FOR INSERT WITH CHECK (true);

-- Functions to update student count when students join/leave
CREATE OR REPLACE FUNCTION update_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE classes SET student_count = student_count + 1 WHERE id = NEW.class_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE classes SET student_count = student_count - 1 WHERE id = OLD.class_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_student_count
    AFTER INSERT OR DELETE ON students
    FOR EACH ROW EXECUTE FUNCTION update_student_count();

-- Function to update lesson updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin functions (run manually for teacher approval)
-- Example: SELECT approve_teacher('teacher@example.com');
CREATE OR REPLACE FUNCTION approve_teacher(teacher_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE teachers 
    SET status = 'approved', approved_at = NOW()
    WHERE email = teacher_email;
END;
$$ LANGUAGE plpgsql;