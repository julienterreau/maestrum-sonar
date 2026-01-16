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

- **🎵 Sonar Maestrum Training System** (NEW!)
  - **Training Datasets Management**: Track uploaded audio datasets for model training
  - **Fine-tuned Models**: Manage custom models trained on user datasets
  - **Generation Presets**: Save and reuse generation configurations
  - **Music Library**: Organized collection of generated and uploaded music
  - **Playlists**: Create and manage music playlists
  - **Training Logs**: Monitor model training progress in real-time

- **Database Integration**
  - Cloudflare D1 SQLite database
  - 9 comprehensive tables for music training and generation
  - Persistent storage of generation requests and training data
  - Fast query performance with optimized indexes

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
Generation requests and results.

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

### 🎵 Sonar Maestrum Tables

#### `training_datasets`
Audio datasets for model training with metadata.

```sql
CREATE TABLE training_datasets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  total_files INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  total_size INTEGER DEFAULT 0,
  status TEXT DEFAULT 'uploading',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `training_files`
Individual audio files within datasets.

#### `fine_tuned_models`
Custom trained models based on user datasets.

```sql
CREATE TABLE fine_tuned_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  base_model TEXT NOT NULL,
  dataset_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  epochs_completed INTEGER DEFAULT 0,
  total_epochs INTEGER,
  training_loss REAL,
  validation_loss REAL,
  ...
);
```

#### `training_logs`
Detailed training progress logs for each model.

#### `generation_presets`
Saved generation configurations for quick reuse.

#### `music_library`
User's collection of generated or uploaded music.

#### `playlists` & `playlist_tracks`
User-created playlists and their associated tracks.

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

### Music Generation

#### POST `/api/generate`
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

#### GET `/api/generations`
Get all generations (last 50).

#### GET `/api/generations/:id`
Get specific generation by ID.

### 🎵 Sonar Maestrum Training API

#### GET `/api/status`
Get database status and table counts.

**Response**:
```json
{
  "status": "online",
  "database": "Sonar Maestrum",
  "tables": {
    "training_datasets": 3,
    "fine_tuned_models": 3,
    "generation_presets": 3,
    "music_library": 3,
    "playlists": 3,
    "generations": 0
  }
}
```

#### GET `/api/training/datasets`
Get all training datasets with metadata.

**Response**:
```json
{
  "datasets": [
    {
      "id": 1,
      "name": "Jazz Collection 2024",
      "genre": "Jazz",
      "total_files": 15,
      "total_duration": 3600,
      "status": "ready"
    }
  ]
}
```

#### GET `/api/training/models`
Get all fine-tuned models with training status.

**Response**:
```json
{
  "models": [
    {
      "id": 1,
      "name": "Jazz Master v1",
      "base_model": "InspireMusic-1.5B",
      "status": "completed",
      "progress": 100,
      "epochs_completed": 50
    }
  ]
}
```

#### GET `/api/presets`
Get generation presets ordered by favorites and usage.

#### GET `/api/library`
Get music library (last 100 tracks).

#### GET `/api/playlists`
Get all playlists with track counts.

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
- [x] **Sonar Maestrum training database** (NEW!)
- [x] **Training datasets, models, and presets API** (NEW!)
- [x] **Music library and playlists structure** (NEW!)

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
