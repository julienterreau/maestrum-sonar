-- Seed data for Sonar Maestrum Training System

-- Sample Training Datasets
INSERT OR IGNORE INTO training_datasets (id, name, description, genre, total_files, total_duration, total_size, status) VALUES
  (1, 'Jazz Collection 2024', 'Professional jazz recordings for training', 'Jazz', 15, 3600, 524288000, 'ready'),
  (2, 'Electronic Beats', 'Modern electronic music samples', 'Electronic', 23, 4200, 687194767, 'ready'),
  (3, 'Classical Symphony', 'Orchestral classical music pieces', 'Classical', 8, 2800, 419430400, 'processing');

-- Sample Training Files
INSERT OR IGNORE INTO training_files (id, dataset_id, filename, original_name, file_path, file_size, duration, sample_rate, channels, format, status) VALUES
  (1, 1, 'jazz_001.mp3', 'Blue Notes.mp3', 'datasets/jazz/jazz_001.mp3', 8388608, 240, 44100, 2, 'mp3', 'ready'),
  (2, 1, 'jazz_002.mp3', 'Midnight Sax.mp3', 'datasets/jazz/jazz_002.mp3', 7340032, 210, 44100, 2, 'mp3', 'ready'),
  (3, 2, 'edm_001.wav', 'Drop Bass.wav', 'datasets/electronic/edm_001.wav', 41943040, 180, 48000, 2, 'wav', 'ready');

-- Sample Fine-tuned Models
INSERT OR IGNORE INTO fine_tuned_models (id, name, description, base_model, dataset_id, status, progress, epochs_completed, total_epochs) VALUES
  (1, 'Jazz Master v1', 'Fine-tuned model for smooth jazz generation', 'InspireMusic-1.5B', 1, 'completed', 100, 50, 50),
  (2, 'EDM Beats Pro', 'Electronic dance music specialist', 'InspireMusic-1.5B-Long', 2, 'training', 60, 30, 50),
  (3, 'Classical Composer', 'Symphony and orchestral music', 'InspireMusic-Base', 3, 'pending', 0, 0, 100);

-- Sample Training Logs
INSERT OR IGNORE INTO training_logs (model_id, epoch, step, loss, learning_rate, log_type, message) VALUES
  (1, 50, 1000, 0.0234, 0.00001, 'metric', 'Training completed successfully'),
  (2, 30, 600, 0.0567, 0.0001, 'metric', 'Training in progress - epoch 30/50');

-- Sample Generation Presets
INSERT OR IGNORE INTO generation_presets (id, name, description, model_id, model_name, style, duration, temperature, top_p, is_favorite, use_count) VALUES
  (1, 'Quick Jazz', 'Fast jazz generation with default settings', 1, NULL, 'verse', 30, 1.0, 0.95, 1, 25),
  (2, 'Long EDM Track', 'Extended electronic dance music', 2, NULL, 'chorus', 60, 1.2, 0.9, 1, 12),
  (3, 'Classical Intro', 'Orchestral introduction piece', NULL, 'InspireMusic-Base', 'intro', 15, 0.8, 0.95, 0, 5);

-- Sample Music Library
INSERT OR IGNORE INTO music_library (id, title, file_path, file_size, duration, genre, mood, tags, is_favorite, play_count) VALUES
  (1, 'Sunset Jazz Boulevard', 'library/sunset_jazz.mp3', 8388608, 240, 'Jazz', 'Relaxed', 'jazz,smooth,evening', 1, 45),
  (2, 'Electric Dreams', 'library/electric_dreams.mp3', 10485760, 300, 'Electronic', 'Energetic', 'edm,dance,upbeat', 1, 78),
  (3, 'Morning Classical', 'library/morning_classical.mp3', 7340032, 180, 'Classical', 'Peaceful', 'classical,calm,morning', 0, 23);

-- Sample Playlists
INSERT OR IGNORE INTO playlists (id, name, description, track_count, total_duration) VALUES
  (1, 'My Favorites', 'Best AI-generated tracks', 2, 540),
  (2, 'Relaxation Mix', 'Calm and peaceful music', 2, 420),
  (3, 'Workout Beats', 'High energy music for exercise', 1, 300);

-- Sample Playlist Tracks
INSERT OR IGNORE INTO playlist_tracks (playlist_id, music_id, position) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (2, 1, 1),
  (2, 3, 2),
  (3, 2, 1);
