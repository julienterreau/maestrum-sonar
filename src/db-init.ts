// Database initialization script for Sonar Maestrum
export async function initializeDatabase(db: D1Database) {
  try {
    console.log('🔧 Starting database initialization...');
    
    // Check if generations table exists
    const result = await db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='generations'
    `).first();

    if (!result) {
      console.log('📦 Creating core tables...');
      
      // 1. Create generations table
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS generations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          prompt TEXT NOT NULL,
          model_name TEXT DEFAULT 'InspireMusic-1.5B-Long',
          style TEXT DEFAULT 'verse',
          duration INTEGER DEFAULT 30,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
          audio_url TEXT,
          file_size INTEGER,
          error_message TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME
        )
      `).run();

      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC)`).run();
      
      console.log('✅ Core tables created');
    }
    
    // Check if Sonar Maestrum tables exist
    const maestrumCheck = await db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='training_datasets'
    `).first();
    
    if (!maestrumCheck) {
      console.log('🎵 Creating Sonar Maestrum training tables...');
      
      // 2. Training Datasets
      await db.prepare(`
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
        )
      `).run();
      
      // 3. Training Files
      await db.prepare(`
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
        )
      `).run();
      
      // 4. Fine-tuned Models
      await db.prepare(`
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
        )
      `).run();
      
      // 5. Training Logs
      await db.prepare(`
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
        )
      `).run();
      
      // 6. Generation Presets
      await db.prepare(`
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
        )
      `).run();
      
      // 7. Music Library
      await db.prepare(`
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
        )
      `).run();
      
      // 8. Playlists
      await db.prepare(`
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
        )
      `).run();
      
      // 9. Playlist Tracks
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS playlist_tracks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          playlist_id INTEGER NOT NULL,
          music_id INTEGER NOT NULL,
          position INTEGER NOT NULL,
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
          FOREIGN KEY (music_id) REFERENCES music_library(id) ON DELETE CASCADE,
          UNIQUE(playlist_id, music_id)
        )
      `).run();
      
      // Create indexes
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_training_files_dataset ON training_files(dataset_id)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_training_files_status ON training_files(status)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_fine_tuned_models_status ON fine_tuned_models(status)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_fine_tuned_models_dataset ON fine_tuned_models(dataset_id)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_training_logs_model ON training_logs(model_id)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_generation_presets_favorite ON generation_presets(is_favorite)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_music_library_favorite ON music_library(is_favorite)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_music_library_genre ON music_library(genre)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id)`).run();
      await db.prepare(`CREATE INDEX IF NOT EXISTS idx_playlist_tracks_music ON playlist_tracks(music_id)`).run();
      
      console.log('✅ Sonar Maestrum tables created');
      
      // Insert seed data
      console.log('🌱 Inserting seed data...');
      
      // Sample Training Datasets
      await db.prepare(`INSERT OR IGNORE INTO training_datasets (id, name, description, genre, total_files, total_duration, total_size, status) VALUES (1, 'Jazz Collection 2024', 'Professional jazz recordings for training', 'Jazz', 15, 3600, 524288000, 'ready')`).run();
      await db.prepare(`INSERT OR IGNORE INTO training_datasets (id, name, description, genre, total_files, total_duration, total_size, status) VALUES (2, 'Electronic Beats', 'Modern electronic music samples', 'Electronic', 23, 4200, 687194767, 'ready')`).run();
      await db.prepare(`INSERT OR IGNORE INTO training_datasets (id, name, description, genre, total_files, total_duration, total_size, status) VALUES (3, 'Classical Symphony', 'Orchestral classical music pieces', 'Classical', 8, 2800, 419430400, 'processing')`).run();
      
      // Sample Fine-tuned Models
      await db.prepare(`INSERT OR IGNORE INTO fine_tuned_models (id, name, description, base_model, dataset_id, status, progress, epochs_completed, total_epochs) VALUES (1, 'Jazz Master v1', 'Fine-tuned model for smooth jazz generation', 'InspireMusic-1.5B', 1, 'completed', 100, 50, 50)`).run();
      await db.prepare(`INSERT OR IGNORE INTO fine_tuned_models (id, name, description, base_model, dataset_id, status, progress, epochs_completed, total_epochs) VALUES (2, 'EDM Beats Pro', 'Electronic dance music specialist', 'InspireMusic-1.5B-Long', 2, 'training', 60, 30, 50)`).run();
      await db.prepare(`INSERT OR IGNORE INTO fine_tuned_models (id, name, description, base_model, dataset_id, status, progress, epochs_completed, total_epochs) VALUES (3, 'Classical Composer', 'Symphony and orchestral music', 'InspireMusic-Base', 3, 'pending', 0, 0, 100)`).run();
      
      // Sample Generation Presets
      await db.prepare(`INSERT OR IGNORE INTO generation_presets (id, name, description, model_id, style, duration, temperature, top_p, is_favorite, use_count) VALUES (1, 'Quick Jazz', 'Fast jazz generation with default settings', 1, 'verse', 30, 1.0, 0.95, 1, 25)`).run();
      await db.prepare(`INSERT OR IGNORE INTO generation_presets (id, name, description, model_id, style, duration, temperature, top_p, is_favorite, use_count) VALUES (2, 'Long EDM Track', 'Extended electronic dance music', 2, 'chorus', 60, 1.2, 0.9, 1, 12)`).run();
      await db.prepare(`INSERT OR IGNORE INTO generation_presets (id, name, description, model_name, style, duration, temperature, top_p, is_favorite, use_count) VALUES (3, 'Classical Intro', 'Orchestral introduction piece', 'InspireMusic-Base', 'intro', 15, 0.8, 0.95, 0, 5)`).run();
      
      // Sample Music Library
      await db.prepare(`INSERT OR IGNORE INTO music_library (id, title, file_path, file_size, duration, genre, mood, tags, is_favorite, play_count) VALUES (1, 'Sunset Jazz Boulevard', 'library/sunset_jazz.mp3', 8388608, 240, 'Jazz', 'Relaxed', 'jazz,smooth,evening', 1, 45)`).run();
      await db.prepare(`INSERT OR IGNORE INTO music_library (id, title, file_path, file_size, duration, genre, mood, tags, is_favorite, play_count) VALUES (2, 'Electric Dreams', 'library/electric_dreams.mp3', 10485760, 300, 'Electronic', 'Energetic', 'edm,dance,upbeat', 1, 78)`).run();
      await db.prepare(`INSERT OR IGNORE INTO music_library (id, title, file_path, file_size, duration, genre, mood, tags, is_favorite, play_count) VALUES (3, 'Morning Classical', 'library/morning_classical.mp3', 7340032, 180, 'Classical', 'Peaceful', 'classical,calm,morning', 0, 23)`).run();
      
      // Sample Playlists
      await db.prepare(`INSERT OR IGNORE INTO playlists (id, name, description, track_count, total_duration) VALUES (1, 'My Favorites', 'Best AI-generated tracks', 2, 540)`).run();
      await db.prepare(`INSERT OR IGNORE INTO playlists (id, name, description, track_count, total_duration) VALUES (2, 'Relaxation Mix', 'Calm and peaceful music', 2, 420)`).run();
      await db.prepare(`INSERT OR IGNORE INTO playlists (id, name, description, track_count, total_duration) VALUES (3, 'Workout Beats', 'High energy music for exercise', 1, 300)`).run();
      
      // Sample Playlist Tracks
      await db.prepare(`INSERT OR IGNORE INTO playlist_tracks (playlist_id, music_id, position) VALUES (1, 1, 1)`).run();
      await db.prepare(`INSERT OR IGNORE INTO playlist_tracks (playlist_id, music_id, position) VALUES (1, 2, 2)`).run();
      await db.prepare(`INSERT OR IGNORE INTO playlist_tracks (playlist_id, music_id, position) VALUES (2, 1, 1)`).run();
      await db.prepare(`INSERT OR IGNORE INTO playlist_tracks (playlist_id, music_id, position) VALUES (2, 3, 2)`).run();
      await db.prepare(`INSERT OR IGNORE INTO playlist_tracks (playlist_id, music_id, position) VALUES (3, 2, 1)`).run();
      
      console.log('✅ Seed data inserted');
    } else {
      console.log('✅ Sonar Maestrum tables already exist');
    }
    
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
