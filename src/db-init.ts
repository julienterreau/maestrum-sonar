// Database initialization script
export async function initializeDatabase(db: D1Database) {
  try {
    // Check if generations table exists
    const result = await db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='generations'
    `).first();

    if (!result) {
      console.log('Creating generations table...');
      
      // Create generations table
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

      // Create indexes
      await db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status)
      `).run();

      await db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC)
      `).run();

      console.log('Database initialized successfully!');
    } else {
      console.log('Database already initialized.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
