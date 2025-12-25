# Server Deployment Guide

Complete guide to deploy Strapi + Next.js blog on a DigitalOcean droplet.

---

## Prerequisites

- DigitalOcean account
- Domain name (optional but recommended)
- SSH client (Terminal/PowerShell)

---

## Step 1: Create DigitalOcean Droplet

1. Log in to [DigitalOcean](https://cloud.digitalocean.com)
2. Click **Create** → **Droplets**
3. Choose:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($12/mo recommended, minimum $6/mo)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
4. Click **Create Droplet**
5. Note your droplet's **IP Address**

---

## Step 2: Connect to Server

```bash
ssh root@YOUR_DROPLET_IP
```

---

## Step 3: Install Docker

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

---

## Step 4: Upload Project Files

**From your local machine:**

```bash
# Upload backend (Strapi)
scp -r backend root@YOUR_DROPLET_IP:/opt/strapi

# Upload frontend (Next.js)
scp -r . root@YOUR_DROPLET_IP:/opt/frontend
```

Or use Git:
```bash
# On server
cd /opt
git clone YOUR_REPO_URL
```

---

## Step 5: Deploy Strapi (Port 4002)

```bash
# Go to Strapi directory
cd /opt/strapi

# Create environment file with secure keys
cat > .env << EOF
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
EOF

# Build and start Strapi
docker-compose -f docker-compose.prod.yml up -d --build

# Check if running
docker ps
```

Wait 2-3 minutes for Strapi to start, then access:
```
http://YOUR_DROPLET_IP:4002/admin
```

---

## Step 6: Configure Strapi

1. **Create Admin Account** at `http://YOUR_DROPLET_IP:4002/admin`
2. **Set API Permissions**:
   - Go to Settings → Users & Permissions → Roles → Public
   - Enable `find` and `findOne` for: Article, Author, Tag, Pillar
   - Click Save
3. **Add Content**:
   - Create 5 Pillars first
   - Create Authors
   - Create Tags
   - Create Articles

---

## Step 7: Deploy Next.js Frontend

```bash
# Go to frontend directory
cd /opt/frontend

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Create environment file
echo "NEXT_PUBLIC_STRAPI_URL=http://YOUR_DROPLET_IP:4002" > .env.local

# Install dependencies and build
npm install
npm run build

# Install PM2 for process management
npm install -g pm2

# Start Next.js
pm2 start npm --name "nextjs" -- start

# Make PM2 start on boot
pm2 startup
pm2 save
```

Frontend accessible at: `http://YOUR_DROPLET_IP:3000`

---

## Step 8: Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
cat > /etc/nginx/sites-available/blog << 'EOF'
# Next.js Frontend
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Strapi API (optional subdomain)
server {
    listen 80;
    server_name api.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:4002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the config
ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## Step 9: Setup SSL (HTTPS)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL Certificate
certbot --nginx -d YOUR_DOMAIN.com -d api.YOUR_DOMAIN.com

# Auto-renewal is configured automatically
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| View Strapi logs | `docker-compose -f /opt/strapi/docker-compose.prod.yml logs -f` |
| Restart Strapi | `docker-compose -f /opt/strapi/docker-compose.prod.yml restart` |
| View Next.js logs | `pm2 logs nextjs` |
| Restart Next.js | `pm2 restart nextjs` |
| Check all services | `docker ps && pm2 status` |

---

## Firewall Setup

```bash
# Enable firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw allow 4002  # Strapi (remove after setting up Nginx)
ufw enable
```

---

## Final URLs

| Service | URL |
|---------|-----|
| Frontend | `https://YOUR_DOMAIN.com` |
| Strapi Admin | `https://api.YOUR_DOMAIN.com/admin` |
| Strapi API | `https://api.YOUR_DOMAIN.com/api` |
