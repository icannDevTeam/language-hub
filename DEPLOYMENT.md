# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Essential Requirements

- [ ] Node.js installed on server (v14+)
- [ ] Domain name purchased (optional but recommended)
- [ ] SSL certificate (Let's Encrypt or paid)
- [ ] Hosting platform chosen (see options below)
- [ ] Database setup (if migrating from JSON files)
- [ ] Backup strategy in place

---

## Deployment Options

### Option 1: Simple VPS Deployment (DigitalOcean, Linode, AWS EC2)

**Best for:** Full control, custom requirements

**Steps:**

1. **Provision Server**
   ```bash
   # SSH into your server
   ssh root@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install Nginx (Web Server)**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

4. **Setup Application**
   ```bash
   cd /var/www
   git clone your-repo-url mandarin-app
   cd mandarin-app
   npm install --production
   ```

5. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/mandarin-app
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/mandarin-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

8. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   cd /var/www/mandarin-app
   pm2 start server.js --name mandarin-app
   pm2 startup
   pm2 save
   ```

**Cost:** $5-10/month  
**Difficulty:** Medium  
**Control:** Full

---

### Option 2: Heroku (Simple PaaS)

**Best for:** Quick deployment, minimal configuration

**Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create mandarin-pronunciation-app
   ```

3. **Add Procfile**
   Create `Procfile` in root:
   ```
   web: node server.js
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

**Cost:** Free tier available, $7+/month for production  
**Difficulty:** Easy  
**Control:** Limited

---

### Option 3: Vercel / Netlify (Serverless)

**Best for:** Auto-scaling, zero-config deployment

**Steps (Vercel):**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Add vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   vercel
   ```

**Cost:** Free tier available, $20+/month for team  
**Difficulty:** Easy  
**Control:** Limited

---

### Option 4: Docker Container

**Best for:** Consistent deployment across platforms

**Steps:**

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       volumes:
         - ./data:/app/data
       restart: always
   ```

3. **Build and Run**
   ```bash
   docker-compose up -d
   ```

**Cost:** Depends on hosting  
**Difficulty:** Medium  
**Control:** High

---

## Post-Deployment Configuration

### 1. Environment Variables

Create `.env` file:
```env
NODE_ENV=production
PORT=3000
CLAUDE_API_KEY=your_key_here  # If needed in future
```

Update `server.js` to use:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

### 2. Database Migration (Recommended)

**From JSON files to MongoDB:**

```bash
npm install mongoose
```

Update data storage logic:
```javascript
// Replace file operations with MongoDB operations
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const lessonSchema = new mongoose.Schema({
  title: String,
  type: String,
  text: String,
  audioData: String,
  createdAt: Date
});

const Lesson = mongoose.model('Lesson', lessonSchema);
```

### 3. Add Authentication

**Install Passport.js:**
```bash
npm install passport passport-local express-session bcrypt
```

**Basic setup:**
```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure authentication
app.use(session({ secret: 'your-secret-key' }));
app.use(passport.initialize());
app.use(passport.session());

// Protect teacher routes
app.use('/teacher', requireAuth);
app.use('/api/lessons', requireAuth);
```

### 4. Add Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Setup Logging

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 6. Configure CORS for Production

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Testing Before Deployment

### Pre-Flight Checklist

- [ ] Test all teacher functions (create, edit, delete lessons)
- [ ] Test all student functions (browse, practice, get feedback)
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Test microphone recording on all platforms
- [ ] Verify AI feedback is working
- [ ] Check all API endpoints
- [ ] Test error handling
- [ ] Verify data persistence
- [ ] Load test with multiple users

### Testing Commands

```bash
# Run the app
npm start

# Test API endpoints
curl http://localhost:3000/api/lessons
curl -X POST http://localhost:3000/api/lessons -H "Content-Type: application/json" -d '{"title":"Test",...}'
```

---

## Monitoring & Maintenance

### Setup Monitoring

**Option 1: PM2 Monitoring**
```bash
pm2 monitor
```

**Option 2: Uptime Robot** (Free)
- Visit uptimerobot.com
- Add monitor for your URL
- Get alerts when site is down

**Option 3: New Relic / DataDog** (Advanced)
- Application performance monitoring
- Error tracking
- User analytics

### Regular Maintenance Tasks

**Daily:**
- [ ] Check server logs
- [ ] Monitor error rates

**Weekly:**
- [ ] Backup database
- [ ] Review disk space
- [ ] Check for npm updates

**Monthly:**
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] User feedback review

---

## Backup Strategy

### Automated Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mandarin-app"

# Backup data files
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" /var/www/mandarin-app/data

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

**Setup Cron Job:**
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Cloud Backups

**AWS S3:**
```bash
aws s3 sync /var/www/mandarin-app/data s3://your-bucket/backups/
```

---

## Security Hardening

### Essential Security Steps

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

2. **Disable Root Login**
   ```bash
   # Edit /etc/ssh/sshd_config
   PermitRootLogin no
   PasswordAuthentication no
   ```

3. **Keep System Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Install Fail2Ban**
   ```bash
   sudo apt install fail2ban
   ```

---

## Performance Optimization

### Node.js Production Settings

```javascript
// server.js
app.set('trust proxy', 1);
app.use(compression());  // npm install compression
app.use(helmet());       // npm install helmet
```

### Nginx Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Domain Configuration

### DNS Settings

```
Type    Name        Value               TTL
A       @           your-server-ip      3600
A       www         your-server-ip      3600
```

### SSL Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Cron job (already set by certbot)
# 0 0 * * * certbot renew --quiet
```

---

## Cost Estimation

### Minimal Setup (Local Network)
- **Cost:** $0
- **Limitations:** Local network only

### Basic Cloud Setup
- **VPS:** $5-10/month (DigitalOcean, Linode)
- **Domain:** $10-15/year
- **SSL:** Free (Let's Encrypt)
- **Total:** ~$70-135/year

### Production Setup
- **VPS/Cloud:** $20-50/month
- **Database:** $15-30/month (MongoDB Atlas)
- **Storage:** $5-10/month (AWS S3)
- **Monitoring:** $0-20/month
- **Total:** ~$480-1320/year

---

## Troubleshooting Deployment Issues

### Issue: App not accessible
- Check firewall rules
- Verify nginx configuration
- Check app is running: `pm2 status`
- Check logs: `pm2 logs`

### Issue: SSL not working
- Verify certbot ran successfully
- Check nginx SSL configuration
- Restart nginx: `sudo systemctl restart nginx`

### Issue: High memory usage
- Increase server resources
- Optimize audio compression
- Add caching

---

## Support Resources

- **DigitalOcean Docs:** https://docs.digitalocean.com
- **Heroku Docs:** https://devcenter.heroku.com
- **Let's Encrypt:** https://letsencrypt.org
- **PM2 Docs:** https://pm2.keymetrics.io
- **Express.js:** https://expressjs.com

---

**Ready to Deploy?** Start with Option 1 (VPS) for full control, or Option 2 (Heroku) for simplicity!

**Need Help?** Review this checklist step-by-step and test each component before moving to the next.
