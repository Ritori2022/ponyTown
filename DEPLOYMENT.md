# 🚀 Pony Town - Cloud Deployment Guide

Complete guide for deploying Pony Town to the cloud using Docker.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Local Deployment](#local-deployment)
5. [Cloud Deployment Options](#cloud-deployment-options)
6. [Production Checklist](#production-checklist)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## 🎯 Quick Start

```bash
# 1. Clone the repository (if not already done)
git clone <your-repo-url>
cd ponyTown

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Configure application
# Edit config.json with your domain, OAuth credentials, etc.

# 4. Generate secure secrets
openssl rand -base64 32  # Use for SESSION_SECRET in config.json
openssl rand -base64 32  # Use for API_TOKEN in config.json

# 5. Start with Docker Compose
docker-compose up -d

# 6. Check logs
docker-compose logs -f ponytown

# 7. Access the game
# Open http://localhost:8090 in your browser
```

---

## ⚙️ Prerequisites

### Required Software

- **Docker** 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- **Git** (for version control)

### System Requirements

**Minimum:**
- 2 CPU cores
- 4GB RAM
- 20GB disk space

**Recommended:**
- 4 CPU cores
- 8GB RAM
- 50GB SSD

### Cloud Platform Requirements

- A VPS/VM instance (e.g., DigitalOcean, AWS EC2, Google Cloud, Azure, Alibaba Cloud)
- Public IP address
- Domain name (optional but recommended)

---

## 🔧 Configuration

### 1. Environment Variables (.env)

```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

**Essential variables:**

```env
# MongoDB credentials
MONGO_USERNAME=admin
MONGO_PASSWORD=your_secure_password_here

# Ports
GAME_PORT=8090
ADMIN_PORT=8091
HTTP_PORT=80
HTTPS_PORT=443
```

### 2. Application Configuration (config.json)

Edit `config.json` with your specific settings:

```json
{
  "title": "My Pony Town",
  "host": "https://yourdomain.com/",
  "secret": "YOUR_SESSION_SECRET_FROM_OPENSSL",
  "token": "YOUR_API_TOKEN_FROM_OPENSSL",
  "db": "mongodb://admin:your_secure_password@mongodb:27017/ponytown?authSource=admin",
  "oauth": {
    "google": {
      "clientID": "YOUR_GOOGLE_CLIENT_ID",
      "clientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    }
  }
}
```

**Important fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `host` | Your public URL | `https://ponytown.example.com/` |
| `secret` | Session secret (32+ chars) | Generate with `openssl rand -base64 32` |
| `token` | API token (32+ chars) | Generate with `openssl rand -base64 32` |
| `db` | MongoDB connection string | Must match Docker Compose settings |

### 3. OAuth Configuration (Optional)

To enable social login, configure OAuth providers:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://yourdomain.com/auth/google/callback`
6. Copy Client ID and Secret to `config.json`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Authorization callback URL: `https://yourdomain.com/auth/github/callback`
4. Copy Client ID and Secret to `config.json`

**Example with multiple OAuth providers:**

```json
{
  "oauth": {
    "google": {
      "clientID": "xxx.apps.googleusercontent.com",
      "clientSecret": "xxx"
    },
    "github": {
      "clientID": "xxx",
      "clientSecret": "xxx"
    },
    "twitter": {
      "consumerKey": "xxx",
      "consumerSecret": "xxx"
    }
  }
}
```

---

## 💻 Local Deployment

### Step 1: Build and Start

```bash
# Build and start all services
docker-compose up -d

# Or build without cache
docker-compose build --no-cache
docker-compose up -d
```

### Step 2: Verify Services

```bash
# Check running containers
docker-compose ps

# Expected output:
# NAME                IMAGE           STATUS          PORTS
# ponytown-app        ponytown        Up              0.0.0.0:8090->8090/tcp
# ponytown-db         mongo:7         Up              27017/tcp
```

### Step 3: Monitor Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ponytown
docker-compose logs -f mongodb
```

### Step 4: Access the Game

Open your browser:
- **Game:** http://localhost:8090
- **Admin Panel:** http://localhost:8091

### Step 5: Create Admin User

```bash
# Get your account ID from MongoDB
docker-compose exec mongodb mongosh -u admin -p changeme123 --authenticationDatabase admin ponytown --eval "db.accounts.find({}, {_id:1, name:1})"

# Add superadmin role
docker-compose exec ponytown node cli.js --addrole <account_id> superadmin
```

---

## ☁️ Cloud Deployment Options

### Option 1: DigitalOcean Droplet (Recommended for Beginners)

**1. Create a Droplet**
- OS: Ubuntu 22.04 LTS
- Plan: Basic ($12/month - 2GB RAM)
- Enable backups

**2. Connect via SSH**
```bash
ssh root@your_droplet_ip
```

**3. Install Docker**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y
```

**4. Clone and Configure**
```bash
# Clone your repository
git clone https://github.com/yourusername/ponyTown.git
cd ponyTown

# Configure
cp .env.example .env
nano .env
nano config.json  # Update host to your domain
```

**5. Set Up Firewall**
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

**6. Deploy**
```bash
docker-compose up -d
```

**7. Set Up Domain (Optional)**
- Point your domain's A record to your Droplet IP
- Update `config.json` with your domain
- Restart: `docker-compose restart ponytown`

---

### Option 2: AWS EC2

**1. Launch EC2 Instance**
- AMI: Ubuntu Server 22.04 LTS
- Instance type: t3.medium (2 vCPU, 4GB RAM)
- Storage: 30GB gp3

**2. Security Group Rules**
```
Type        Protocol    Port Range    Source
SSH         TCP         22            Your IP
HTTP        TCP         80            0.0.0.0/0
HTTPS       TCP         443           0.0.0.0/0
Custom      TCP         8090          0.0.0.0/0  (game port)
```

**3. Connect and Install**
```bash
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com
sudo apt update && sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu
```

**4. Deploy**
Follow same steps as DigitalOcean from step 4 onwards.

---

### Option 3: Google Cloud Platform (GCP)

**1. Create Compute Engine VM**
```bash
gcloud compute instances create ponytown \
  --zone=us-central1-a \
  --machine-type=e2-standard-2 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB
```

**2. Configure Firewall**
```bash
gcloud compute firewall-rules create ponytown-http \
  --allow tcp:80,tcp:443,tcp:8090
```

**3. SSH and Install**
```bash
gcloud compute ssh ponytown --zone=us-central1-a
# Then follow DigitalOcean steps
```

---

### Option 4: Azure

**1. Create Virtual Machine**
- Image: Ubuntu Server 22.04 LTS
- Size: Standard_B2s (2 vCPU, 4GB RAM)
- Public IP: Static

**2. Configure NSG (Network Security Group)**
- Allow inbound ports: 22, 80, 443, 8090

**3. Connect and Deploy**
```bash
ssh azureuser@your-vm-ip
# Follow DigitalOcean steps
```

---

### Option 5: Railway / Render (Easiest, Limited Free Tier)

**Note:** These PaaS platforms have limitations - MongoDB must be hosted separately.

#### Railway
1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add MongoDB service from Railway marketplace
4. Set environment variables
5. Deploy

#### Render
1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Build Command: `npm run build`
4. Start Command: `node pony-town.js --login --admin --game`
5. Add MongoDB via external provider (MongoDB Atlas)

---

## ✅ Production Checklist

### Security

- [ ] Change default MongoDB password
- [ ] Generate strong `secret` and `token` in config.json
- [ ] Enable firewall (UFW/iptables/security groups)
- [ ] Set up HTTPS with Let's Encrypt
- [ ] Configure rate limiting in nginx
- [ ] Disable unnecessary ports
- [ ] Regular security updates: `apt update && apt upgrade`

### Performance

- [ ] Enable nginx caching
- [ ] Configure MongoDB indexes
- [ ] Set up log rotation
- [ ] Monitor resource usage (CPU, RAM, disk)
- [ ] Configure swap space (if RAM < 4GB)

### Monitoring

- [ ] Set up health checks
- [ ] Configure log aggregation
- [ ] Enable uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up alerts for downtime

### Backup

- [ ] Database backups (daily): `mongodump`
- [ ] Config file backups
- [ ] Automated backup script (see below)

---

## 🛠️ HTTPS Setup (Let's Encrypt)

### Using Certbot with Nginx

```bash
# 1. Install Certbot
apt install certbot python3-certbot-nginx -y

# 2. Get certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 3. Update config.json
nano config.json
# Change "host": "https://yourdomain.com/"

# 4. Update nginx.conf
# Uncomment SSL server block in nginx.conf

# 5. Restart services
docker-compose restart nginx ponytown

# 6. Auto-renewal
certbot renew --dry-run
```

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs ponytown

# Common issues:
# 1. MongoDB not ready - wait 30s and try again
# 2. Port already in use
sudo netstat -tulpn | grep :8090
# Kill process using the port
```

### Database connection error

```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check credentials in config.json match .env
# Connection string format:
# mongodb://USERNAME:PASSWORD@mongodb:27017/DATABASE?authSource=admin
```

### Can't access from browser

```bash
# Check firewall
sudo ufw status

# Check if service is listening
docker-compose exec ponytown netstat -tulpn | grep :8090

# Check container health
docker-compose ps
```

### Build fails

```bash
# Clear Docker cache
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔄 Maintenance

### Update Application

```bash
# Pull latest code
cd /path/to/ponyTown
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f ponytown
```

### Backup Database

**Manual backup:**
```bash
# Create backup
docker-compose exec mongodb mongodump \
  --username=admin \
  --password=changeme123 \
  --authenticationDatabase=admin \
  --out=/data/backup

# Copy to host
docker cp ponytown-db:/data/backup ./mongodb-backup-$(date +%Y%m%d)
```

**Automated backup script:**
```bash
#!/bin/bash
# Save as backup.sh
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
docker-compose exec -T mongodb mongodump \
  --username=admin \
  --password=changeme123 \
  --authenticationDatabase=admin \
  --archive > $BACKUP_DIR/mongodb_$DATE.archive

# Keep only last 7 days
find $BACKUP_DIR -name "mongodb_*.archive" -mtime +7 -delete

# Backup config
cp config.json $BACKUP_DIR/config_$DATE.json
```

**Add to crontab:**
```bash
crontab -e
# Add: 0 2 * * * /root/ponyTown/backup.sh
```

### Restore Database

```bash
# From archive
docker-compose exec -T mongodb mongorestore \
  --username=admin \
  --password=changeme123 \
  --authenticationDatabase=admin \
  --archive < mongodb_backup.archive
```

### View Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f ponytown
docker-compose logs -f mongodb
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h
docker system df

# Memory usage
free -h
```

---

## 📊 Scaling

### Horizontal Scaling (Multiple Game Servers)

Edit `config.json` to add multiple servers:

```json
{
  "servers": [
    {
      "id": "server1",
      "port": 8090,
      "path": "/s00/ws",
      "name": "Server 1"
    },
    {
      "id": "server2",
      "port": 8092,
      "path": "/s01/ws",
      "name": "Server 2"
    }
  ]
}
```

Update `docker-compose.yml` to expose additional ports.

---

## 🆘 Support

### Common Resources

- **Project Repository:** [GitHub](https://github.com/yourusername/ponyTown)
- **Original Project:** [Pony Town](https://github.com/Agamnentzar/pony-town)
- **Docker Docs:** [docs.docker.com](https://docs.docker.com)

### Logs to Check

1. Application logs: `docker-compose logs ponytown`
2. MongoDB logs: `docker-compose logs mongodb`
3. Nginx logs: `docker-compose logs nginx`
4. System logs: `/var/log/syslog`

---

## 📝 License

See [LICENSE](LICENSE) file in the repository.

---

**Happy Deploying! 🎉**

If you encounter any issues, check the logs first and refer to the troubleshooting section.
