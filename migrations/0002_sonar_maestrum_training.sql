-- Sonar Maestrum: Advanced Training and Music Creation System
-- Migration 0002: Training datasets, models, and fine-tuning

-- Training Datasets table
-- Stores uploaded audio files and metadata for model training
CREATE TABLE IF NOT EXISTS training_datasets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  genre TEXT,                          -- Genre of music (jazz, classical, electronic, etc.)
  total_files INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,    -- Total duration in seconds
  total_size INTEGER DEFAULT 0,        -- Total size in bytes
  status TEXT DEFAULT 'uploading' CHECK(status IN ('uploading', 'processing', 'ready', 'failed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Training Files table
-- Individual audio files within a dataset
CREATE TABLE IF NOT EXISTS training_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,             -- R2 storage path
  file_size INTEGER NOT NULL,          -- Size in bytes
  duration INTEGER,                    -- Duration in seconds
  sample_rate INTEGER,                 -- Audio sample rate (e.g., 44100)
  channels INTEGER,                    -- Number of audio channels (1=mono, 2=stereo)
  format TEXT,                         -- Audio format (mp3, wav, flac, etc.)
  metadata TEXT,                       -- JSON metadata (BPM, key, tags, etc.)
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'ready', 'failed')),
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES training_datasets(id) ON DELETE CASCADE
);

-- Fine-tuned Models table
-- Custom trained models based on user datasets
CREATE TABLE IF NOT EXISTS fine_tuned_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  base_model TEXT NOT NULL,            -- Base model used (InspireMusic-Base, 1.5B, etc.)
  dataset_id INTEGER NOT NULL,
  training_config TEXT,                -- JSON training configuration (epochs, batch_size, etc.)
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'queued', 'training', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0,          -- Training progress (0-100)
  model_path TEXT,                     -- R2 storage path for trained model
  model_size INTEGER,                  -- Model size in bytes
  training_loss REAL,                  -- Final training loss
  validation_loss REAL,                -- Final validation loss
  epochs_completed INTEGER DEFAULT 0,
  total_epochs INTEGER,
  training_time INTEGER,               -- Training time in seconds
  error_message TEXT,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES training_datasets(id)
);

-- Training Logs table
-- Detailed logs for training progress
CREATE TABLE IF NOT EXISTS training_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id INTEGER NOT NULL,
  epoch INTEGER,
  step INTEGER,
  loss REAL,
  learning_rate REAL,
  metrics TEXT,                        -- JSON metrics (accuracy, etc.)
  message TEXT,
  log_type TEXT DEFAULT 'info' CHECK(log_type IN ('info', 'warning', 'error', 'metric')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model_id) REFERENCES fine_tuned_models(id) ON DELETE CASCADE
);

-- Generation Presets table
-- Saved generation configurations for quick reuse
CREATE TABLE IF NOT EXISTS generation_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  model_id INTEGER,                    -- Can reference a fine-tuned model
  model_name TEXT,                     -- Or use a standard model
  style TEXT,
  duration INTEGER,
  temperature REAL,                    -- Generation temperature (creativity)
  top_p REAL,                          -- Nucleus sampling parameter
  additional_params TEXT,              -- JSON for additional parameters
  is_favorite INTEGER DEFAULT 0,
  use_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model_id) REFERENCES fine_tuned_models(id) ON DELETE SET NULL
);

-- Music Library table
-- User's collection of generated or uploaded music
CREATE TABLE IF NOT EXISTS music_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  generation_id INTEGER,               -- Link to generations table if AI-generated
  file_path TEXT NOT NULL,             -- R2 storage path
  file_size INTEGER,
  duration INTEGER,
  thumbnail_url TEXT,                  -- Waveform or album art
  genre TEXT,
  mood TEXT,                           -- Happy, sad, energetic, calm, etc.
  tags TEXT,                           -- Comma-separated tags
  is_favorite INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE SET NULL
);

-- Playlists table
-- User-created playlists
CREATE TABLE IF NOT EXISTS playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_public INTEGER DEFAULT 0,
  track_count INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Playlist Tracks table
-- Junction table for playlists and music library
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id INTEGER NOT NULL,
  music_id INTEGER NOT NULL,
  position INTEGER NOT NULL,           -- Track order in playlist
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (music_id) REFERENCES music_library(id) ON DELETE CASCADE,
  UNIQUE(playlist_id, music_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_files_dataset ON training_files(dataset_id);
CREATE INDEX IF NOT EXISTS idx_training_files_status ON training_files(status);
CREATE INDEX IF NOT EXISTS idx_fine_tuned_models_status ON fine_tuned_models(status);
CREATE INDEX IF NOT EXISTS idx_fine_tuned_models_dataset ON fine_tuned_models(dataset_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_model ON training_logs(model_id);
CREATE INDEX IF NOT EXISTS idx_generation_presets_favorite ON generation_presets(is_favorite);
CREATE INDEX IF NOT EXISTS idx_music_library_favorite ON music_library(is_favorite);
CREATE INDEX IF NOT EXISTS idx_music_library_genre ON music_library(genre);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_music ON playlist_tracks(music_id);

-- Add metadata columns to existing generations table
-- (Only adds if they don't exist - safe for existing data)
ALTER TABLE generations ADD COLUMN preset_id INTEGER;
ALTER TABLE generations ADD COLUMN fine_tuned_model_id INTEGER;
ALTER TABLE generations ADD COLUMN temperature REAL DEFAULT 1.0;
ALTER TABLE generations ADD COLUMN top_p REAL DEFAULT 0.95;
