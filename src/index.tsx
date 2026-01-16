import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, Generation, GenerateRequest } from './types'
import { initializeDatabase } from './db-init'

const app = new Hono<{ Bindings: Bindings }>()

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './' }))

// Database initialization middleware
let dbInitialized = false
app.use('*', async (c, next) => {
  if (!dbInitialized && c.env.DB) {
    try {
      await initializeDatabase(c.env.DB)
      dbInitialized = true
    } catch (error) {
      console.error('Failed to initialize database:', error)
    }
  }
  await next()
})

// Enable CORS for API routes
app.use('/api/*', cors())

// API Routes
app.post('/api/generate', async (c) => {
  const { DB, R2, MODELSCOPE_API_KEY } = c.env
  
  try {
    const body = await c.req.json<GenerateRequest>()
    const { prompt, model_name = 'InspireMusic-1.5B-Long', style = 'verse', duration = 30 } = body

    if (!prompt || prompt.trim().length === 0) {
      return c.json({ error: 'Prompt is required' }, 400)
    }

    // Insert generation request into database
    const result = await DB.prepare(`
      INSERT INTO generations (prompt, model_name, style, duration, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(prompt, model_name, style, duration).run()

    const generationId = result.meta.last_row_id

    // In a real implementation, this would trigger an async job
    // For now, we return immediately with pending status
    return c.json({
      id: generationId,
      status: 'pending',
      message: 'Generation request submitted. Check back soon for results.'
    })
  } catch (error) {
    console.error('Error creating generation:', error)
    return c.json({ error: 'Failed to create generation request' }, 500)
  }
})

app.get('/api/generations', async (c) => {
  const { DB } = c.env
  
  try {
    const { results } = await DB.prepare(`
      SELECT * FROM generations 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all<Generation>()

    return c.json({ generations: results })
  } catch (error) {
    console.error('Error fetching generations:', error)
    return c.json({ error: 'Failed to fetch generations' }, 500)
  }
})

app.get('/api/generations/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  
  try {
    const result = await DB.prepare(`
      SELECT * FROM generations WHERE id = ?
    `).bind(id).first<Generation>()

    if (!result) {
      return c.json({ error: 'Generation not found' }, 404)
    }

    return c.json(result)
  } catch (error) {
    console.error('Error fetching generation:', error)
    return c.json({ error: 'Failed to fetch generation' }, 500)
  }
})

// Sonar Maestrum API Routes

// Get all training datasets
app.get('/api/training/datasets', async (c) => {
  const { DB } = c.env
  try {
    const { results } = await DB.prepare(`
      SELECT * FROM training_datasets 
      ORDER BY created_at DESC
    `).all()
    return c.json({ datasets: results })
  } catch (error) {
    console.error('Error fetching datasets:', error)
    return c.json({ error: 'Failed to fetch datasets' }, 500)
  }
})

// Get all fine-tuned models
app.get('/api/training/models', async (c) => {
  const { DB } = c.env
  try {
    const { results } = await DB.prepare(`
      SELECT m.*, d.name as dataset_name 
      FROM fine_tuned_models m
      LEFT JOIN training_datasets d ON m.dataset_id = d.id
      ORDER BY m.created_at DESC
    `).all()
    return c.json({ models: results })
  } catch (error) {
    console.error('Error fetching models:', error)
    return c.json({ error: 'Failed to fetch models' }, 500)
  }
})

// Get generation presets
app.get('/api/presets', async (c) => {
  const { DB } = c.env
  try {
    const { results } = await DB.prepare(`
      SELECT p.*, m.name as model_display_name
      FROM generation_presets p
      LEFT JOIN fine_tuned_models m ON p.model_id = m.id
      ORDER BY is_favorite DESC, use_count DESC
    `).all()
    return c.json({ presets: results })
  } catch (error) {
    console.error('Error fetching presets:', error)
    return c.json({ error: 'Failed to fetch presets' }, 500)
  }
})

// Get music library
app.get('/api/library', async (c) => {
  const { DB } = c.env
  try {
    const { results } = await DB.prepare(`
      SELECT * FROM music_library 
      ORDER BY created_at DESC 
      LIMIT 100
    `).all()
    return c.json({ music: results })
  } catch (error) {
    console.error('Error fetching library:', error)
    return c.json({ error: 'Failed to fetch library' }, 500)
  }
})

// Get playlists
app.get('/api/playlists', async (c) => {
  const { DB } = c.env
  try {
    const { results } = await DB.prepare(`
      SELECT * FROM playlists 
      ORDER BY updated_at DESC
    `).all()
    return c.json({ playlists: results })
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return c.json({ error: 'Failed to fetch playlists' }, 500)
  }
})

// Get database status (diagnostic endpoint)
app.get('/api/status', async (c) => {
  const { DB } = c.env
  try {
    const datasets = await DB.prepare(`SELECT COUNT(*) as count FROM training_datasets`).first()
    const models = await DB.prepare(`SELECT COUNT(*) as count FROM fine_tuned_models`).first()
    const presets = await DB.prepare(`SELECT COUNT(*) as count FROM generation_presets`).first()
    const music = await DB.prepare(`SELECT COUNT(*) as count FROM music_library`).first()
    const playlists = await DB.prepare(`SELECT COUNT(*) as count FROM playlists`).first()
    const generations = await DB.prepare(`SELECT COUNT(*) as count FROM generations`).first()
    
    return c.json({
      status: 'online',
      database: 'Sonar Maestrum',
      tables: {
        training_datasets: datasets?.count || 0,
        fine_tuned_models: models?.count || 0,
        generation_presets: presets?.count || 0,
        music_library: music?.count || 0,
        playlists: playlists?.count || 0,
        generations: generations?.count || 0
      }
    })
  } catch (error) {
    console.error('Error fetching status:', error)
    return c.json({ error: 'Failed to fetch status', status: 'error' }, 500)
  }
})

// Training Studio API Routes

// Upload audio files for training
app.post('/api/training/upload', async (c) => {
  const { DB, R2 } = c.env
  
  try {
    const formData = await c.req.formData()
    const datasetName = formData.get('dataset_name') as string
    const genre = formData.get('genre') as string
    const files = formData.getAll('files')
    
    if (!datasetName || !genre) {
      return c.json({ error: 'Dataset name and genre are required' }, 400)
    }
    
    // Create dataset
    const datasetResult = await DB.prepare(`
      INSERT INTO training_datasets (name, genre, total_files, status)
      VALUES (?, ?, ?, 'uploading')
    `).bind(datasetName, genre, files.length).run()
    
    const datasetId = datasetResult.meta.last_row_id
    
    // In production, files would be uploaded to R2
    // For now, just track metadata
    
    return c.json({
      dataset_id: datasetId,
      files_count: files.length,
      message: 'Dataset created successfully'
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return c.json({ error: 'Failed to upload files' }, 500)
  }
})

// Start training
app.post('/api/training/start', async (c) => {
  const { DB } = c.env
  
  try {
    const body = await c.req.json()
    const { 
      dataset_id, 
      base_model, 
      epochs = 50, 
      batch_size = 16, 
      learning_rate = 0.001,
      synths = []
    } = body
    
    if (!dataset_id || !base_model) {
      return c.json({ error: 'Dataset ID and base model are required' }, 400)
    }
    
    // Create training job
    const config = JSON.stringify({
      epochs,
      batch_size,
      learning_rate,
      synths
    })
    
    const result = await DB.prepare(`
      INSERT INTO fine_tuned_models (
        name, 
        base_model, 
        dataset_id, 
        training_config, 
        status, 
        total_epochs
      )
      VALUES (?, ?, ?, ?, 'queued', ?)
    `).bind(
      `Model-${Date.now()}`,
      base_model,
      dataset_id,
      config,
      epochs
    ).run()
    
    const modelId = result.meta.last_row_id
    
    // In production, this would trigger actual training
    return c.json({
      model_id: modelId,
      status: 'queued',
      message: 'Training job created successfully'
    })
  } catch (error) {
    console.error('Error starting training:', error)
    return c.json({ error: 'Failed to start training' }, 500)
  }
})

// Get training progress
app.get('/api/training/progress/:id', async (c) => {
  const { DB } = c.env
  const modelId = c.req.param('id')
  
  try {
    const model = await DB.prepare(`
      SELECT * FROM fine_tuned_models WHERE id = ?
    `).bind(modelId).first()
    
    if (!model) {
      return c.json({ error: 'Model not found' }, 404)
    }
    
    // Get recent logs
    const { results: logs } = await DB.prepare(`
      SELECT * FROM training_logs 
      WHERE model_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `).bind(modelId).all()
    
    return c.json({
      model,
      recent_logs: logs
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return c.json({ error: 'Failed to fetch progress' }, 500)
  }
})

// Stop training
app.post('/api/training/stop/:id', async (c) => {
  const { DB } = c.env
  const modelId = c.req.param('id')
  
  try {
    await DB.prepare(`
      UPDATE fine_tuned_models 
      SET status = 'cancelled' 
      WHERE id = ?
    `).bind(modelId).run()
    
    return c.json({ message: 'Training stopped successfully' })
  } catch (error) {
    console.error('Error stopping training:', error)
    return c.json({ error: 'Failed to stop training' }, 500)
  }
})

// Music Library API - Get all uploaded music
app.get('/api/library', async (c) => {
  const { DB } = c.env
  
  try {
    const result = await DB.prepare(`
      SELECT * FROM music_library 
      ORDER BY created_at DESC
    `).all()
    
    return c.json({ 
      music: result.results || [],
      count: result.results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching library:', error)
    return c.json({ error: 'Failed to fetch library' }, 500)
  }
})

// Upload music file to R2 and add to library
app.post('/api/library/upload', async (c) => {
  const { DB, R2 } = c.env
  
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const genre = formData.get('genre') as string || 'autre'
    const title = formData.get('title') as string || file.name
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const filename = `music/${timestamp}-${file.name}`
    
    // Upload to R2 (Cloudflare Object Storage)
    if (R2) {
      await R2.put(filename, await file.arrayBuffer(), {
        httpMetadata: {
          contentType: file.type
        }
      })
    }
    
    // Add to database
    const result = await DB.prepare(`
      INSERT INTO music_library (title, artist, genre, duration, file_url, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      title,
      'User Upload',
      genre,
      0, // Duration will be updated by frontend
      filename,
      file.size
    ).run()
    
    return c.json({
      id: result.meta.last_row_id,
      filename,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading music:', error)
    return c.json({ error: 'Failed to upload music' }, 500)
  }
})

// Delete music from library
app.delete('/api/library/:id', async (c) => {
  const { DB, R2 } = c.env
  const id = c.req.param('id')
  
  try {
    // Get file URL first
    const music = await DB.prepare(`
      SELECT file_url FROM music_library WHERE id = ?
    `).bind(id).first()
    
    if (!music) {
      return c.json({ error: 'Music not found' }, 404)
    }
    
    // Delete from R2
    if (R2 && music.file_url) {
      await R2.delete(music.file_url)
    }
    
    // Delete from database
    await DB.prepare(`
      DELETE FROM music_library WHERE id = ?
    `).bind(id).run()
    
    return c.json({ message: 'Music deleted successfully' })
  } catch (error) {
    console.error('Error deleting music:', error)
    return c.json({ error: 'Failed to delete music' }, 500)
  }
})

// Get music file from R2
app.get('/api/library/file/:filename', async (c) => {
  const { R2 } = c.env
  const filename = c.req.param('filename')
  
  try {
    if (!R2) {
      return c.notFound()
    }
    
    const object = await R2.get(filename)
    
    if (!object) {
      return c.notFound()
    }
    
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'audio/mpeg',
        'Content-Length': object.size.toString(),
        'Cache-Control': 'public, max-age=31536000'
      }
    })
  } catch (error) {
    console.error('Error fetching file:', error)
    return c.notFound()
  }
})

// Simple Interface (Sonauto-style) - serve HTML inline for now
app.get('/simple', async (c) => {
  // In production with Cloudflare Pages, files are served automatically from dist/
  // For now, return a simple redirect or inline HTML
  return c.html(await fetch(new URL('/simple.html', c.req.url)).then(r => r.text()).catch(() => `
    <!DOCTYPE html>
    <html><head><meta http-equiv="refresh" content="0;url=/"></head>
    <body>Loading...</body></html>
  `))
})

// Upload Music Page
app.get('/upload', (c) => {
  return c.redirect('/upload-music.html')
})

// Training Studio Page
app.get('/training', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎵 Training Studio - Sonar Maestrum</title>
    <script>
        // Redirect to the training page
        window.location.href = '/training.html';
    </script>
</head>
<body>
    <p>Redirecting to Training Studio...</p>
</body>
</html>`)
})

// Premium Studio Route
app.get('/premium', (c) => {
  return c.redirect('/maestrum-premium.html')
})

// Main page - redirect to simple interface
app.get('/', (c) => {
  return c.redirect('/simple')
})

export default app
