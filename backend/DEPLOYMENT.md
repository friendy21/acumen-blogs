# DigitalOcean Droplet Deployment Guide

Deploy Strapi CMS to a DigitalOcean droplet in development mode.

## Prerequisites

- DigitalOcean account
- SSH access to your droplet
- Domain name (optional, for HTTPS)

## Quick Deploy

### 1. Create Droplet

Create a new droplet on DigitalOcean:
- **Image**: Ubuntu 22.04
- **Size**: Basic ($6/mo) or higher
- **Datacenter**: Choose closest to your users

### 2. Connect to Droplet

```bash
ssh root@your-droplet-ip
```

### 3. Upload Backend Files

From your local machine:
```bash
scp -r backend root@your-droplet-ip:/opt/strapi
```

### 4. Run Deploy Script

On the droplet:
```bash
cd /opt/strapi
chmod +x deploy.sh
./deploy.sh
```

This will:
- Install Docker and Docker Compose
- Generate secure environment keys
- Build and start Strapi

### 5. Access Strapi

Open in browser: `http://your-droplet-ip:4002/admin`

---

## Development Mode Setup

If you want Strapi running in development mode (with hot reload):

```bash
cd /opt/strapi
docker-compose -f docker-compose.yml up -d
```

---

## SSL with Nginx (Optional)

### Install Nginx and Certbot

```bash
apt install nginx certbot python3-certbot-nginx -y
```

### Configure Nginx

```bash
cp nginx.conf /etc/nginx/sites-available/strapi
ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Get SSL Certificate

```bash
certbot --nginx -d your-domain.com
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `docker-compose -f docker-compose.prod.yml logs -f` | View logs |
| `docker-compose -f docker-compose.prod.yml restart` | Restart Strapi |
| `docker-compose -f docker-compose.prod.yml down` | Stop Strapi |
| `docker-compose -f docker-compose.prod.yml up -d --build` | Rebuild and start |

---

## Environment Variables

Edit `/opt/strapi/.env` to configure:

| Variable | Description |
|----------|-------------|
| `APP_KEYS` | Encryption keys (comma-separated) |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | JWT secret for admin |
| `DATABASE_CLIENT` | `sqlite` or `postgres` |

---

## Connecting Frontend

Update your Next.js frontend `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://your-droplet-ip:4002
# Or with domain:
NEXT_PUBLIC_STRAPI_URL=https://your-domain.com
```
