# RegulateThis Blog

A [Next.js](https://nextjs.org) blog application with [Strapi CMS](https://strapi.io) v5.33 backend.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (recommended for Windows users)

---

## Option 1: Docker (Recommended)

The easiest way to run Strapi on Windows is with Docker:

```bash
cd backend
docker compose up -d
```

Strapi will be available at [http://localhost:4002/admin](http://localhost:4002/admin)

---

## Option 2: Native (Linux/macOS)

```bash
# Start Strapi
cd backend
npm run develop

# In another terminal, start the frontend
cd ..
npm run dev
```

---

## Post-Setup Configuration

### 1. Create Admin Account
Visit [http://localhost:4002/admin](http://localhost:4002/admin) and create your admin account.

### 2. Configure API Permissions
1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public**
3. Enable permissions for Article, Author, Pillar, Tag: `find`, `findOne`
4. Click **Save**

### 3. Create Content Pillars
Add these pillars first:
- Compliance & Regulation
- Technology & Operations
- Practice Management
- Client Strategy
- Industry Insights

### 4. Configure Frontend
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:4002
```

---

## Project Structure

```
├── app/                 # Next.js pages
├── components/          # React components
├── lib/
│   ├── strapi.ts       # Strapi API client
│   ├── data-service.ts # Unified data layer
│   └── mock-data.ts    # Fallback mock data
├── backend/            # Strapi CMS (v5.33)
│   ├── src/api/        # Content types
│   ├── config/         # Strapi configuration
│   ├── Dockerfile      # Production Docker
│   ├── Dockerfile.dev  # Development Docker
│   └── docker-compose.yml
└── types/              # TypeScript types
```

---

## Content Types

| Type | Fields |
|------|--------|
| **Article** | title, subtitle, slug, content, excerpt, pillar, tags, author, featuredImage, publishDate, readTime, isFeatured |
| **Author** | name, title, bio, photo, linkedin, twitter, email |
| **Tag** | name, slug |
| **Pillar** | name, slug, description |

---

## DigitalOcean Deployment

For production deployment:
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy using Docker or App Platform

See [Strapi Deployment Docs](https://docs.strapi.io/dev-docs/deployment)

---

## Troubleshooting

### Windows SQLite Error
If you get "SqliteError: unable to open database file", use Docker instead:
```bash
cd backend
docker compose up -d
```
