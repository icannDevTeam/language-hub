// Supabase Configuration Template
// Copy this file to supabase-config.js and fill in your actual credentials
// NEVER commit supabase-config.js to git - it's in .gitignore for security

// Replace these with your actual Supabase project credentials
// Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
const db = {
    // Teacher Management
    async createTeacher(email, name) {
        // Check if email ends with @binus.edu for auto-approval
        const isBinusEmail = email.toLowerCase().endsWith('@binus.edu');
        const status = isBinusEmail ? 'approved' : 'pending';
        const approvedAt = isBinusEmail ? new Date().toISOString() : null;

        const { data, error } = await supabaseClient
            .from('teachers')
            .insert([{
                email,
                name,
                status,
                created_at: new Date().toISOString(),
                approved_at: approvedAt
            }])
            .select()
            .single();
        
        return { data, error };
    },

    async getTeacher(email) {
        const { data, error } = await supabaseClient
            .from('teachers')
            .select('*')
            .eq('email', email)
            .eq('status', 'approved')  // Only return approved teachers
            .single();
        
        return { data, error };
    },

    async getAllTeachers() {
        const { data, error } = await supabaseClient
            .from('teachers')
            .select('*')
            .order('created_at', { ascending: false });
        
        return { data, error };
    },

    // Lesson Management
    async createLesson(lesson) {
        const { data, error } = await supabaseClient
            .from('lessons')
            .insert([{
                ...lesson,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        return { data, error };
    },

    async getLessonsByTeacher(teacherEmail) {
        const { data, error } = await supabaseClient
            .from('lessons')
            .select('*')
            .eq('teacher_email', teacherEmail)
            .order('created_at', { ascending: false });
        
        return { data, error };
    },

    async getAllPublicLessons() {
        const { data, error } = await supabaseClient
            .from('lessons')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false });
        
        return { data, error };
    },

    // Student Progress
    async saveStudentProgress(studentName, lessonId, xpEarned, achievements) {
        const { data, error } = await supabaseClient
            .from('student_progress')
            .upsert([{
                student_name: studentName,
                lesson_id: lessonId,
                xp_earned: xpEarned,
                achievements: achievements,
                last_activity: new Date().toISOString()
            }], { 
                onConflict: 'student_name,lesson_id' 
            })
            .select()
            .single();
        
        return { data, error };
    },

    async getStudentProgress(studentName) {
        const { data, error } = await supabaseClient
            .from('student_progress')
            .select('*')
            .eq('student_name', studentName)
            .order('last_activity', { ascending: false });
        
        return { data, error };
    }
};

// Authentication helper functions
const auth = {
    async signUp(email, password, name) {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name }
            }
        });
        return { data, error };
    },

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        return { error };
    },

    async getCurrentUser() {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        return { user, error };
    }
};