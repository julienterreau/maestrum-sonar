// 🎵 Sonar Maestrum Training Studio - Frontend Logic

// Banque d'instruments de synthèse par genre
const SYNTH_BANK = {
    jazz: [
        { id: 'rhodes', name: 'Fender Rhodes', icon: 'piano', power: 9, description: 'Piano électrique légendaire' },
        { id: 'organ', name: 'Hammond B3', icon: 'music', power: 9, description: 'Orgue jazz classique' },
        { id: 'sax', name: 'Saxophone Synth', icon: 'wind', power: 8, description: 'Saxophone synthétique riche' },
        { id: 'bass', name: 'Jazz Bass', icon: 'guitar', power: 8, description: 'Basse jazz chaleureuse' },
        { id: 'drums-jazz', name: 'Jazz Drums', icon: 'drum', power: 7, description: 'Batterie jazz dynamique' }
    ],
    electronic: [
        { id: 'moog', name: 'Moog Sub 37', icon: 'wave-square', power: 10, description: 'Synthé analogique puissant' },
        { id: 'serum', name: 'Serum Wavetable', icon: 'waveform', power: 10, description: 'Synthé wavetable moderne' },
        { id: '808', name: 'TR-808', icon: 'drum', power: 9, description: 'Boîte à rythmes légendaire' },
        { id: 'fm', name: 'FM8', icon: 'signal', power: 9, description: 'Synthèse FM complexe' },
        { id: 'massive', name: 'Massive X', icon: 'bolt', power: 9, description: 'Synthé bass puissant' },
        { id: 'omnisphere', name: 'Omnisphere', icon: 'star', power: 10, description: 'Synthé universel premium' }
    ],
    classical: [
        { id: 'piano', name: 'Steinway Grand', icon: 'piano', power: 10, description: 'Piano à queue premium' },
        { id: 'strings', name: 'String Ensemble', icon: 'violin', power: 9, description: 'Ensemble orchestral' },
        { id: 'brass', name: 'Brass Section', icon: 'trumpet', power: 8, description: 'Section de cuivres' },
        { id: 'woodwinds', name: 'Woodwind Ensemble', icon: 'flute', power: 8, description: 'Bois orchestraux' },
        { id: 'harp', name: 'Concert Harp', icon: 'harp', power: 7, description: 'Harpe de concert' }
    ],
    rock: [
        { id: 'guitar-distortion', name: 'Distortion Guitar', icon: 'guitar-electric', power: 9, description: 'Guitare saturée' },
        { id: 'guitar-clean', name: 'Clean Guitar', icon: 'guitar', power: 8, description: 'Guitare claire' },
        { id: 'bass-rock', name: 'Rock Bass', icon: 'bass', power: 9, description: 'Basse rock puissante' },
        { id: 'drums-rock', name: 'Rock Drums', icon: 'drum-set', power: 9, description: 'Batterie rock énergique' },
        { id: 'synth-lead', name: 'Synth Lead', icon: 'keyboard', power: 8, description: 'Lead synth moderne' }
    ],
    hiphop: [
        { id: '808-bass', name: '808 Sub Bass', icon: 'speaker', power: 10, description: 'Sub bass profond' },
        { id: 'mpc', name: 'MPC Drums', icon: 'drum-machine', power: 9, description: 'Batterie hip-hop' },
        { id: 'rhodes-hiphop', name: 'Lo-Fi Rhodes', icon: 'piano-vintage', power: 8, description: 'Rhodes lo-fi' },
        { id: 'brass-stabs', name: 'Brass Stabs', icon: 'trumpet-loud', power: 8, description: 'Coups de cuivres' },
        { id: 'synth-pluck', name: 'Pluck Synth', icon: 'pulse', power: 7, description: 'Plucks synthétiques' }
    ],
    ambient: [
        { id: 'pad', name: 'Ambient Pad', icon: 'cloud', power: 9, description: 'Nappes atmosphériques' },
        { id: 'texture', name: 'Texture Synth', icon: 'texture', power: 9, description: 'Textures évolutives' },
        { id: 'drone', name: 'Drone Engine', icon: 'wave', power: 8, description: 'Drones profonds' },
        { id: 'granular', name: 'Granular Synth', icon: 'grain', power: 10, description: 'Synthèse granulaire' },
        { id: 'field', name: 'Field Recordings', icon: 'microphone', power: 7, description: 'Enregistrements naturels' }
    ],
    pop: [
        { id: 'piano-pop', name: 'Pop Piano', icon: 'piano-keys', power: 8, description: 'Piano pop moderne' },
        { id: 'synth-pop', name: 'Synth Pop', icon: 'synthesizer', power: 9, description: 'Synthés pop 80s' },
        { id: 'bass-synth', name: 'Synth Bass', icon: 'bass-synth', power: 8, description: 'Basse synthétique' },
        { id: 'drums-pop', name: 'Pop Drums', icon: 'drum-modern', power: 8, description: 'Batterie pop punchy' },
        { id: 'vocal-synth', name: 'Vocal Synth', icon: 'voice', power: 7, description: 'Voix synthétiques' }
    ],
    metal: [
        { id: 'guitar-metal', name: 'Metal Guitar', icon: 'guitar-heavy', power: 10, description: 'Guitare métal extrême' },
        { id: 'bass-metal', name: 'Metal Bass', icon: 'bass-heavy', power: 9, description: 'Basse métal lourde' },
        { id: 'drums-metal', name: 'Metal Drums', icon: 'drum-heavy', power: 10, description: 'Batterie double pédale' },
        { id: 'synth-industrial', name: 'Industrial Synth', icon: 'gear', power: 9, description: 'Synthés industriels' },
        { id: 'choir', name: 'Epic Choir', icon: 'choir', power: 8, description: 'Chœurs épiques' }
    ]
};

// État global
let uploadedFiles = [];
let selectedSynths = [];
let trainingInterval = null;
let lossChart = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initDropZone();
    initFileInput();
    initGenreSelector();
    initTrainingButton();
    loadSynthsForGenre('jazz'); // Genre par défaut
});

// Drop Zone
function initDropZone() {
    const dropZone = document.getElementById('dropZone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// File Input
function initFileInput() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('audio/')) {
            uploadedFiles.push({
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                id: Date.now() + Math.random()
            });
        }
    });
    
    renderFilesList();
    updateStats();
}

function renderFilesList() {
    const filesList = document.getElementById('filesList');
    
    if (uploadedFiles.length === 0) {
        filesList.innerHTML = '';
        return;
    }
    
    filesList.innerHTML = uploadedFiles.map(file => `
        <div class="glass rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <i class="fas fa-file-audio text-2xl text-purple-400"></i>
                <div>
                    <p class="text-white font-semibold">${file.name}</p>
                    <p class="text-white opacity-70 text-sm">${formatBytes(file.size)}</p>
                </div>
            </div>
            <button onclick="removeFile('${file.id}')" class="text-red-400 hover:text-red-300 transition-colors">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    renderFilesList();
    updateStats();
}

// Genre Selector
function initGenreSelector() {
    const genreSelect = document.getElementById('genre');
    genreSelect.addEventListener('change', (e) => {
        loadSynthsForGenre(e.target.value);
    });
}

function loadSynthsForGenre(genre) {
    const synthBank = document.getElementById('synthBank');
    const synths = SYNTH_BANK[genre] || [];
    
    // Reset selections
    selectedSynths = [];
    
    synthBank.innerHTML = synths.map(synth => `
        <div class="synth-card glass rounded-lg p-4 cursor-pointer" data-synth-id="${synth.id}" onclick="toggleSynth('${synth.id}')">
            <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-${synth.icon} text-purple-400 text-xl"></i>
                    <h3 class="text-white font-bold">${synth.name}</h3>
                </div>
                <div class="flex items-center space-x-1">
                    ${Array(synth.power).fill('<i class="fas fa-star text-yellow-400 text-xs"></i>').join('')}
                </div>
            </div>
            <p class="text-white opacity-70 text-sm">${synth.description}</p>
            <div class="mt-2 flex items-center justify-between">
                <span class="text-purple-400 text-xs font-semibold">POWER: ${synth.power}/10</span>
                <i class="fas fa-check-circle text-green-400 text-xl hidden" data-check="${synth.id}"></i>
            </div>
        </div>
    `).join('');
    
    updateStats();
}

function toggleSynth(synthId) {
    const card = document.querySelector(`[data-synth-id="${synthId}"]`);
    const check = document.querySelector(`[data-check="${synthId}"]`);
    
    if (selectedSynths.includes(synthId)) {
        selectedSynths = selectedSynths.filter(id => id !== synthId);
        card.classList.remove('selected');
        check.classList.add('hidden');
    } else {
        selectedSynths.push(synthId);
        card.classList.add('selected');
        check.classList.remove('hidden');
    }
    
    updateStats();
}

// Training Button
function initTrainingButton() {
    const btn = document.getElementById('startTrainingBtn');
    btn.addEventListener('click', startTraining);
    
    document.getElementById('stopTrainingBtn')?.addEventListener('click', stopTraining);
}

async function startTraining() {
    // Validation
    if (uploadedFiles.length === 0) {
        alert('❌ Veuillez uploader au moins un fichier audio');
        return;
    }
    
    if (selectedSynths.length === 0) {
        alert('❌ Veuillez sélectionner au moins un synthétiseur');
        return;
    }
    
    const datasetName = document.getElementById('datasetName').value;
    if (!datasetName) {
        alert('❌ Veuillez donner un nom à votre dataset');
        return;
    }
    
    // Prepare training data
    const trainingData = {
        dataset_name: datasetName,
        genre: document.getElementById('genre').value,
        base_model: document.getElementById('baseModel').value,
        epochs: parseInt(document.getElementById('epochs').value),
        batch_size: parseInt(document.getElementById('batchSize').value),
        learning_rate: parseFloat(document.getElementById('learningRate').value),
        synths: selectedSynths,
        files: uploadedFiles.length
    };
    
    console.log('🚀 Starting training with config:', trainingData);
    
    // Show progress section
    document.getElementById('trainingProgress').classList.remove('hidden');
    document.getElementById('startTrainingBtn').disabled = true;
    document.getElementById('totalEpochs').textContent = trainingData.epochs;
    
    // Initialize loss chart
    initLossChart();
    
    // Simulate training (in real app, this would be an API call)
    simulateTraining(trainingData);
}

function simulateTraining(config) {
    let currentEpoch = 0;
    let losses = [];
    
    trainingInterval = setInterval(() => {
        currentEpoch++;
        
        // Simulate loss decreasing
        const loss = 2.0 * Math.exp(-currentEpoch / 20) + Math.random() * 0.1;
        losses.push(loss);
        
        // Update UI
        document.getElementById('currentEpoch').textContent = currentEpoch;
        const progress = (currentEpoch / config.epochs) * 100;
        document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Update time remaining
        const timePerEpoch = 2; // seconds
        const remainingSeconds = (config.epochs - currentEpoch) * timePerEpoch;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        document.getElementById('timeRemaining').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update chart
        updateLossChart(losses);
        
        // Complete
        if (currentEpoch >= config.epochs) {
            completeTraining();
        }
    }, 500); // Update every 500ms for demo
}

function stopTraining() {
    if (trainingInterval) {
        clearInterval(trainingInterval);
        trainingInterval = null;
    }
    
    alert('⏹️ Entraînement arrêté');
    resetTraining();
}

function completeTraining() {
    if (trainingInterval) {
        clearInterval(trainingInterval);
        trainingInterval = null;
    }
    
    alert('🎉 Entraînement terminé avec succès ! Votre modèle est prêt à être utilisé.');
    resetTraining();
}

function resetTraining() {
    document.getElementById('trainingProgress').classList.add('hidden');
    document.getElementById('startTrainingBtn').disabled = false;
    document.getElementById('currentEpoch').textContent = '0';
    document.getElementById('progressPercent').textContent = '0%';
    document.getElementById('progressBar').style.width = '0%';
}

// Loss Chart
function initLossChart() {
    const ctx = document.getElementById('lossChart').getContext('2d');
    
    if (lossChart) {
        lossChart.destroy();
    }
    
    lossChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Training Loss',
                data: [],
                borderColor: 'rgb(79, 172, 254)',
                backgroundColor: 'rgba(79, 172, 254, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function updateLossChart(losses) {
    if (!lossChart) return;
    
    lossChart.data.labels = losses.map((_, i) => `Epoch ${i + 1}`);
    lossChart.data.datasets[0].data = losses;
    lossChart.update();
}

// Stats
function updateStats() {
    document.getElementById('filesCount').textContent = uploadedFiles.length;
    
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    document.getElementById('totalSize').textContent = formatBytes(totalSize);
    
    // Simulate duration (in real app, would analyze audio)
    const avgDuration = 180; // 3 minutes per file
    const totalSeconds = uploadedFiles.length * avgDuration;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    document.getElementById('totalDuration').textContent = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    
    document.getElementById('synthsCount').textContent = selectedSynths.length;
}

// Utilities
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
