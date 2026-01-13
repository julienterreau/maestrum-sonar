import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings, Generation, GenerateRequest } from './types'
import { initializeDatabase } from './db-init'

const app = new Hono<{ Bindings: Bindings }>()

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

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎵 InspireMusic Generator</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .gradient-bg {
                background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
                background-size: 400% 400%;
                animation: gradient 15s ease infinite;
            }
            .glass {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        </style>
    </head>
    <body class="gradient-bg min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold text-white mb-4">
                    <i class="fas fa-music mr-3"></i>
                    InspireMusic Generator
                </h1>
                <p class="text-xl text-white opacity-90">
                    Create amazing music with AI-powered generation
                </p>
            </div>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Generation Form -->
                <div class="lg:col-span-2">
                    <div class="glass rounded-2xl p-8 shadow-2xl">
                        <h2 class="text-2xl font-bold text-white mb-6">
                            <i class="fas fa-wand-magic-sparkles mr-2"></i>
                            Generate Music
                        </h2>
                        
                        <form id="generateForm" class="space-y-6">
                            <!-- Prompt -->
                            <div>
                                <label class="block text-white font-semibold mb-2">
                                    <i class="fas fa-pen mr-2"></i>
                                    Music Description
                                </label>
                                <textarea 
                                    id="prompt" 
                                    rows="4" 
                                    class="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="Describe the music you want to create... e.g., 'Smooth jazz with gentle piano and saxophone for a relaxing evening'"
                                    required
                                ></textarea>
                            </div>

                            <!-- Model Selection -->
                            <div>
                                <label class="block text-white font-semibold mb-2">
                                    <i class="fas fa-robot mr-2"></i>
                                    Model
                                </label>
                                <select 
                                    id="model" 
                                    class="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    <option value="InspireMusic-1.5B-Long">InspireMusic 1.5B Long (Recommended)</option>
                                    <option value="InspireMusic-1.5B">InspireMusic 1.5B</option>
                                    <option value="InspireMusic-Base">InspireMusic Base</option>
                                </select>
                            </div>

                            <!-- Style -->
                            <div>
                                <label class="block text-white font-semibold mb-2">
                                    <i class="fas fa-palette mr-2"></i>
                                    Style
                                </label>
                                <select 
                                    id="style" 
                                    class="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    <option value="intro">Intro</option>
                                    <option value="verse" selected>Verse</option>
                                    <option value="chorus">Chorus</option>
                                    <option value="bridge">Bridge</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <!-- Duration -->
                            <div>
                                <label class="block text-white font-semibold mb-2">
                                    <i class="fas fa-clock mr-2"></i>
                                    Duration: <span id="durationValue">30</span>s
                                </label>
                                <input 
                                    type="range" 
                                    id="duration" 
                                    min="5" 
                                    max="60" 
                                    value="30" 
                                    step="5"
                                    class="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                                    oninput="document.getElementById('durationValue').textContent = this.value"
                                >
                            </div>

                            <!-- Submit Button -->
                            <button 
                                type="submit" 
                                id="generateBtn"
                                class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                <i class="fas fa-sparkles mr-2"></i>
                                Generate Music
                            </button>
                        </form>

                        <!-- Status Message -->
                        <div id="statusMessage" class="mt-6 hidden"></div>
                    </div>
                </div>

                <!-- Info Panel -->
                <div class="space-y-6">
                    <!-- API Key Notice -->
                    <div class="glass rounded-2xl p-6 shadow-2xl">
                        <h3 class="text-xl font-bold text-white mb-4">
                            <i class="fas fa-key mr-2"></i>
                            Setup Required
                        </h3>
                        <p class="text-white opacity-90 mb-4">
                            To use this app, you need to configure your API keys:
                        </p>
                        <ul class="text-white opacity-80 space-y-2 text-sm">
                            <li><i class="fas fa-check-circle text-green-300 mr-2"></i>ModelScope API Key</li>
                            <li><i class="fas fa-check-circle text-green-300 mr-2"></i>HuggingFace API Key (optional)</li>
                        </ul>
                        <a href="#" class="mt-4 inline-block text-purple-200 hover:text-white text-sm">
                            <i class="fas fa-question-circle mr-1"></i>
                            How to get API keys?
                        </a>
                    </div>

                    <!-- Features -->
                    <div class="glass rounded-2xl p-6 shadow-2xl">
                        <h3 class="text-xl font-bold text-white mb-4">
                            <i class="fas fa-star mr-2"></i>
                            Features
                        </h3>
                        <ul class="text-white opacity-90 space-y-3 text-sm">
                            <li><i class="fas fa-check text-green-300 mr-2"></i>Text-to-Music Generation</li>
                            <li><i class="fas fa-check text-green-300 mr-2"></i>Multiple Model Options</li>
                            <li><i class="fas fa-check text-green-300 mr-2"></i>Style Control</li>
                            <li><i class="fas fa-check text-green-300 mr-2"></i>Adjustable Duration</li>
                            <li><i class="fas fa-hourglass-half text-yellow-300 mr-2"></i>Generation History (coming soon)</li>
                            <li><i class="fas fa-hourglass-half text-yellow-300 mr-2"></i>Audio Player (coming soon)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Generations History -->
            <div class="mt-12">
                <div class="glass rounded-2xl p-8 shadow-2xl">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-white">
                            <i class="fas fa-history mr-2"></i>
                            Recent Generations
                        </h2>
                        <button 
                            onclick="loadGenerations()" 
                            class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition"
                        >
                            <i class="fas fa-refresh mr-2"></i>
                            Refresh
                        </button>
                    </div>
                    
                    <div id="generationsList" class="space-y-4">
                        <p class="text-white opacity-70 text-center py-8">
                            <i class="fas fa-music text-4xl mb-4"></i><br>
                            No generations yet. Create your first music!
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Form submission
            document.getElementById('generateForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const btn = document.getElementById('generateBtn');
                const statusDiv = document.getElementById('statusMessage');
                
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
                
                const data = {
                    prompt: document.getElementById('prompt').value,
                    model_name: document.getElementById('model').value,
                    style: document.getElementById('style').value,
                    duration: parseInt(document.getElementById('duration').value)
                };

                try {
                    const response = await axios.post('/api/generate', data);
                    
                    statusDiv.className = 'mt-6 p-4 bg-green-500 bg-opacity-20 border border-green-400 text-white rounded-lg';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-check-circle mr-2"></i>
                        <strong>Success!</strong> Generation #\${response.data.id} submitted. 
                        <br><small class="opacity-80">\${response.data.message}</small>
                    \`;
                    statusDiv.classList.remove('hidden');
                    
                    // Clear form
                    document.getElementById('prompt').value = '';
                    
                    // Reload generations
                    setTimeout(() => loadGenerations(), 1000);
                    
                } catch (error) {
                    statusDiv.className = 'mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 text-white rounded-lg';
                    statusDiv.innerHTML = \`
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <strong>Error:</strong> \${error.response?.data?.error || error.message}
                    \`;
                    statusDiv.classList.remove('hidden');
                }
                
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sparkles mr-2"></i> Generate Music';
            });

            // Load generations
            async function loadGenerations() {
                const listDiv = document.getElementById('generationsList');
                
                try {
                    const response = await axios.get('/api/generations');
                    const generations = response.data.generations;
                    
                    if (generations.length === 0) {
                        listDiv.innerHTML = \`
                            <p class="text-white opacity-70 text-center py-8">
                                <i class="fas fa-music text-4xl mb-4"></i><br>
                                No generations yet. Create your first music!
                            </p>
                        \`;
                        return;
                    }
                    
                    listDiv.innerHTML = generations.map(gen => {
                        const statusColors = {
                            'pending': 'bg-yellow-500',
                            'processing': 'bg-blue-500',
                            'completed': 'bg-green-500',
                            'failed': 'bg-red-500'
                        };
                        
                        const statusIcons = {
                            'pending': 'fa-clock',
                            'processing': 'fa-spinner fa-spin',
                            'completed': 'fa-check-circle',
                            'failed': 'fa-times-circle'
                        };
                        
                        return \`
                            <div class="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-2">
                                            <span class="\${statusColors[gen.status]} px-2 py-1 rounded text-xs font-semibold text-white">
                                                <i class="fas \${statusIcons[gen.status]} mr-1"></i>
                                                \${gen.status.toUpperCase()}
                                            </span>
                                            <span class="text-white opacity-60 text-sm">
                                                <i class="fas fa-hashtag"></i>\${gen.id}
                                            </span>
                                            <span class="text-white opacity-60 text-sm">
                                                <i class="fas fa-calendar"></i>
                                                \${new Date(gen.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p class="text-white font-medium mb-1">\${gen.prompt}</p>
                                        <p class="text-white opacity-70 text-sm">
                                            <i class="fas fa-robot mr-1"></i>\${gen.model_name} 
                                            <span class="mx-2">•</span>
                                            <i class="fas fa-palette mr-1"></i>\${gen.style}
                                            <span class="mx-2">•</span>
                                            <i class="fas fa-clock mr-1"></i>\${gen.duration}s
                                        </p>
                                    </div>
                                    \${gen.status === 'completed' ? \`
                                        <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition">
                                            <i class="fas fa-play mr-2"></i>Play
                                        </button>
                                    \` : ''}
                                </div>
                            </div>
                        \`;
                    }).join('');
                    
                } catch (error) {
                    console.error('Error loading generations:', error);
                    listDiv.innerHTML = \`
                        <p class="text-red-300 text-center py-8">
                            <i class="fas fa-exclamation-triangle text-2xl mb-2"></i><br>
                            Failed to load generations
                        </p>
                    \`;
                }
            }

            // Load generations on page load
            loadGenerations();
            
            // Auto-refresh every 10 seconds
            setInterval(loadGenerations, 10000);
        </script>
    </body>
    </html>
  `)
})

export default app
