# 🔒 Security Setup Guide

## ⚠️ IMPORTANT: Credential Management

This project uses **Supabase** for cloud storage and authentication. To maintain security, credentials are **NEVER** committed to the repository.

## 🚨 Critical Security Files

### Files PROTECTED by `.gitignore`:
- `supabase-config.js` - Contains actual Supabase credentials
- `.env` files - Environment variables
- `node_modules/` - Dependencies

### Files SAFE to commit:
- `supabase-config.template.js` - Template without real credentials
- All other project files

## 🛠️ Setup Instructions

### 1. Copy Template Configuration
```bash
cp supabase-config.template.js supabase-config.js
```

### 2. Get Your Supabase Credentials
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiI...`)

### 3. Update Configuration
Edit `supabase-config.js` and replace:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

With your actual values:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🔐 Security Features Implemented

### 1. Auto-Approval for BINUS Faculty
- Teachers with `@binus.edu` emails are automatically approved
- No manual admin intervention required
- Instant access to teaching tools

### 2. Teacher Authentication
- Secure email/password authentication via Supabase Auth
- Protected teacher portal access
- Session management

### 3. Data Protection
- All sensitive data stored in Supabase cloud
- Encrypted connections (HTTPS)
- Row-level security policies

## 🚀 Deployment Security

### For Development:
1. Keep `supabase-config.js` locally only
2. Never commit this file
3. Share credentials securely with team members

### For Production:
1. Use environment variables instead of config file
2. Set up proper CORS policies in Supabase
3. Enable RLS (Row Level Security) policies
4. Use production Supabase keys

## 🆘 Troubleshooting

### If you accidentally commit credentials:
1. **IMMEDIATELY** regenerate your Supabase keys
2. Update the new keys in your local config
3. Remove the file from git history:
```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch supabase-config.js' --prune-empty --tag-name-filter cat -- --all
```

### If the app can't connect to Supabase:
1. Check your credentials in `supabase-config.js`
2. Verify your Supabase project is active
3. Check browser console for connection errors
4. Ensure CORS is configured in Supabase

## 📞 Support

If you need help with security setup, contact the development team. **Never share credentials in public channels!**

---

## ✅ Security Checklist

- [ ] Copied `supabase-config.template.js` to `supabase-config.js`
- [ ] Updated with real Supabase credentials
- [ ] Verified `supabase-config.js` is in `.gitignore`
- [ ] Tested authentication locally
- [ ] **Never committed actual credentials to git**
- [ ] Shared credentials securely with team (if needed)

**Remember: Security is everyone's responsibility! 🛡️**