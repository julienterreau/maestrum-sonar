# 🎵 InspireMusic Generator

A beautiful web application for AI-powered music generation using InspireMusic models from FunAudioLLM.

## 🌐 Live Demo

**Local Development**: https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai
**Production**: *Coming soon after deployment*

## ✨ Features

### ✅ Currently Implemented

- **Text-to-Music Generation**
  - Describe your music in natural language
  - Multiple InspireMusic model options (Base, 1.5B, 1.5B-Long)
  - Style control (intro, verse, chorus, bridge, outro)
  - Adjustable duration (5-60 seconds)

- **Beautiful UI**
  - Gradient animated background
  - Glassmorphism design elements
  - Responsive layout for all devices
  - Real-time status updates

- **Generation History**
  - View all past generations
  - Track generation status (pending, processing, completed, failed)
  - Auto-refresh every 10 seconds
  - Detailed generation metadata

- **Database Integration**
  - Cloudflare D1 SQLite database
  - Persistent storage of generation requests
  - Fast query performance with indexes

### 🔮 Coming Soon (Phase 2)

- **Music Continuation**
  - Upload existing audio files
  - Extend and continue music seamlessly
  
- **Audio Playback**
  - Built-in audio player
  - Waveform visualization
  - Playlist management

- **Download & Share**
  - Download generated music files
  - Share links with others
  - Export in multiple formats

- **External API Integration**
  - ModelScope API connection
  - HuggingFace API connection
  - Actual music generation (currently UI only)

- **Fine-tuning (Future)**
  - Upload custom training datasets
  - Train genre-specific models
  - Monitor training progress

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CLOUDFLARE PAGES WEB APP                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Hono Backend (TypeScript)                           │   │
│  │  - REST API routes                                    │   │
│  │  - Database management                                │   │
│  │  - File upload/download                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend UI (HTML/CSS/JS)                           │   │
│  │  - TailwindCSS + Font Awesome                         │   │
│  │  - Axios for API calls                                │   │
│  │  - Real-time updates                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Storage:                                                    │
│  - Cloudflare D1: Generation history & metadata            │
│  - Cloudflare R2: Audio files (configured, not yet used)   │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│  EXTERNAL AI SERVICES (To be integrated)                    │
│  - ModelScope InspireMusic API                              │
│  - HuggingFace Spaces                                        │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

- **Backend**: Hono 4.x (Lightweight web framework)
- **Runtime**: Cloudflare Workers/Pages
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Build Tool**: Vite 6.x
- **Development**: PM2, Wrangler
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd webapp

# Install dependencies
npm install

# Build the project
npm run build

# Apply database migrations (local)
npm run db:migrate:local

# Start development server
npm run dev:sandbox

# Or use PM2 (recommended)
pm2 start ecosystem.config.cjs
```

### Development

```bash
# Clean port 3000
npm run clean-port

# Build project
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# View logs
pm2 logs webapp --nostream

# Restart
pm2 restart webapp

# Stop
pm2 stop webapp
```

## 🗄️ Database Schema

### `generations` Table

```sql
CREATE TABLE generations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt TEXT NOT NULL,
  model_name TEXT DEFAULT 'InspireMusic-1.5B-Long',
  style TEXT DEFAULT 'verse',
  duration INTEGER DEFAULT 30,
  status TEXT DEFAULT 'pending',
  audio_url TEXT,
  file_size INTEGER,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);
```

**Indexes**:
- `idx_generations_status` on `status`
- `idx_generations_created_at` on `created_at DESC`

## 🔧 Configuration

### Environment Variables (`.dev.vars` for local development)

```bash
# ModelScope API Key (get from https://modelscope.cn)
MODELSCOPE_API_KEY=your_api_key_here

# HuggingFace API Key (get from https://huggingface.co)
HUGGINGFACE_API_KEY=your_api_key_here
```

### Cloudflare Configuration (`wrangler.jsonc`)

```jsonc
{
  "name": "webapp",
  "compatibility_date": "2026-01-13",
  "d1_databases": [{
    "binding": "DB",
    "database_name": "webapp-production",
    "database_id": ""  // Will be filled after creating production DB
  }],
  "r2_buckets": [{
    "binding": "R2",
    "bucket_name": "webapp-audio"
  }]
}
```

## 📝 API Endpoints

### POST `/api/generate`

Generate music from text description.

**Request**:
```json
{
  "prompt": "Smooth jazz with gentle piano for a relaxing evening",
  "model_name": "InspireMusic-1.5B-Long",
  "style": "verse",
  "duration": 30
}
```

**Response**:
```json
{
  "id": 1,
  "status": "pending",
  "message": "Generation request submitted. Check back soon for results."
}
```

### GET `/api/generations`

Get all generations (last 50).

**Response**:
```json
{
  "generations": [
    {
      "id": 1,
      "prompt": "Smooth jazz...",
      "model_name": "InspireMusic-1.5B-Long",
      "style": "verse",
      "duration": 30,
      "status": "pending",
      "audio_url": null,
      "created_at": "2026-01-13 23:47:34"
    }
  ]
}
```

### GET `/api/generations/:id`

Get specific generation by ID.

## 🚢 Deployment

### Production Deployment to Cloudflare Pages

```bash
# 1. Create production D1 database
npx wrangler d1 create webapp-production
# Copy the database_id to wrangler.jsonc

# 2. Apply migrations to production
npm run db:migrate:prod

# 3. Create R2 bucket (if needed)
npx wrangler r2 bucket create webapp-audio

# 4. Build and deploy
npm run deploy:prod
```

### Setting Up API Keys in Production

```bash
# Add ModelScope API key
npx wrangler pages secret put MODELSCOPE_API_KEY --project-name webapp

# Add HuggingFace API key
npx wrangler pages secret put HUGGINGFACE_API_KEY --project-name webapp
```

## 📊 Project Structure

```
webapp/
├── src/
│   ├── index.tsx          # Main Hono application
│   ├── db-init.ts         # Database initialization
│   └── types.ts           # TypeScript type definitions
├── migrations/
│   └── 0001_initial_schema.sql   # Database schema
├── public/
│   └── static/            # Static assets (future use)
├── .wrangler/             # Local development state (gitignored)
├── dist/                  # Build output (gitignored)
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## 🎯 Roadmap

### Phase 1: MVP (✅ Completed)
- [x] Project setup with Hono + Cloudflare Pages
- [x] Database schema and integration
- [x] Beautiful responsive UI
- [x] Generation history dashboard
- [x] Local development environment

### Phase 2: External API Integration (🔄 In Progress)
- [ ] ModelScope API integration
- [ ] HuggingFace API integration
- [ ] Actual music generation
- [ ] Audio file storage in R2
- [ ] Audio playback functionality

### Phase 3: Enhanced Features (📋 Planned)
- [ ] Music continuation (upload + extend)
- [ ] User authentication
- [ ] Usage limits and quotas
- [ ] Generation queue management
- [ ] Webhook notifications

### Phase 4: Advanced Features (🔮 Future)
- [ ] Fine-tuning interface
- [ ] Custom model training
- [ ] Genre-specific models
- [ ] Batch generation
- [ ] API key management UI

## 🐛 Known Issues

1. **Music Generation Not Active**: Currently, the app only creates database entries. Actual music generation via ModelScope/HuggingFace APIs will be implemented in Phase 2.

2. **Audio Playback**: UI includes play buttons but audio playback is not yet functional (waiting for actual audio file generation).

3. **Local Database ID**: The `database_id` in `wrangler.jsonc` is empty for local development. This is normal and doesn't affect local functionality.

## 🤝 Contributing

This is currently a personal project. Contributions, suggestions, and feedback are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **FunAudioLLM Team** for the InspireMusic models
- **Cloudflare** for the amazing Workers/Pages platform
- **Hono** for the lightweight web framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a Phase 1 MVP. The actual music generation functionality using ModelScope/HuggingFace APIs will be added in Phase 2 once you provide your API keys.
