-- Sonar Maestrum: Advanced Training and Music Creation System
-- Migration 0002: Training datasets, models, and fine-tuning (without ALTER TABLE)

-- Training Datasets table
CREATE TABLE IF NOT EXISTS training_datasets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  total_files INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  total_size INTEGER DEFAULT 0,
  status TEXT DEFAULT 'uploading' CHECK(status IN ('uploading', 'processing', 'ready', 'failed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Training Files table
CREATE TABLE IF NOT EXISTS training_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  duration INTEGER,
  sample_rate INTEGER,
  channels INTEGER,
  format TEXT,
  metadata TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'ready', 'failed')),
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES training_datasets(id) ON DELETE CASCADE
);

-- Fine-tuned Models table
CREATE TABLE IF NOT EXISTS fine_tuned_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  base_model TEXT NOT NULL,
  dataset_id INTEGER NOT NULL,
  training_config TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'queued', 'training', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0,
  model_path TEXT,
  model_size INTEGER,
  training_loss REAL,
  validation_loss REAL,
  epochs_completed INTEGER DEFAULT 0,
  total_epochs INTEGER,
  training_time INTEGER,
  error_message TEXT,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES training_datasets(id)
);

-- Training Logs table
CREATE TABLE IF NOT EXISTS training_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id INTEGER NOT NULL,
  epoch INTEGER,
  step INTEGER,
  loss REAL,
  learning_rate REAL,
  metrics TEXT,
  message TEXT,
  log_type TEXT DEFAULT 'info' CHECK(log_type IN ('info', 'warning', 'error', 'metric')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model_id) REFERENCES fine_tuned_models(id) ON DELETE CASCADE
);

-- Generation Presets table
CREATE TABLE IF NOT EXISTS generation_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  model_id INTEGER,
  model_name TEXT,
  style TEXT,
  duration INTEGER,
  temperature REAL,
  top_p REAL,
  additional_params TEXT,
  is_favorite INTEGER DEFAULT 0,
  use_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model_id) REFERENCES fine_tuned_models(id) ON DELETE SET NULL
);

-- Music Library table
CREATE TABLE IF NOT EXISTS music_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  generation_id INTEGER,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  duration INTEGER,
  thumbnail_url TEXT,
  genre TEXT,
  mood TEXT,
  tags TEXT,
  is_favorite INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE SET NULL
);

-- Playlists table
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
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id INTEGER NOT NULL,
  music_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (music_id) REFERENCES music_library(id) ON DELETE CASCADE,
  UNIQUE(playlist_id, music_id)
);

-- Create indexes
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
