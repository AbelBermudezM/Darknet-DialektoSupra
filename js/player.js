export function initAudioPlayer() {
    const audioEl = document.getElementById('podcast-audio');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const timeDisplay = document.getElementById('time-display');
    const visualizerBars = document.querySelectorAll('.audio-bar');
    
    if (!audioEl || !playBtn) return;

    let audioContext;
    let analyser;
    let dataArray;
    let isInitialized = false;

    // Format time (seconds to m:ss)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // Initialize Web Audio API
    function initWebAudio() {
        if (isInitialized) return;
        
        // Use standard or webkit audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        
        const source = audioContext.createMediaElementSource(audioEl);
        analyser = audioContext.createAnalyser();
        
        // Configure analyser
        analyser.fftSize = 64; 
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Connect nodes
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        isInitialized = true;
        drawVisualizer();
    }

    // Main visualizer loop
    function drawVisualizer() {
        if (!audioEl.paused) {
            requestAnimationFrame(drawVisualizer);
        }
        
        analyser.getByteFrequencyData(dataArray);
        
        // Map frequency data to our CSS bars
        // The bars array length is typically smaller than dataArray (e.g., 7 bars vs 32 bins)
        const step = Math.floor(dataArray.length / visualizerBars.length);
        
        visualizerBars.forEach((bar, index) => {
            // Get average value for this frequency band
            let sum = 0;
            for (let i = 0; i < step; i++) {
                sum += dataArray[index * step + i];
            }
            const average = sum / step;
            
            // Map 0-255 to 10%-100% height
            // We use 10% min to always show a tiny bit of the bar
            const height = 10 + (average / 255) * 90;
            
            bar.style.height = `${height}%`;
        });
    }

    // Play/Pause toggle
    playBtn.addEventListener('click', () => {
        // Must resume AudioContext after user gesture
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (audioEl.paused) {
            if (!isInitialized) initWebAudio();
            audioEl.play().then(() => {
                // Change icon to pause
                playBtn.innerHTML = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;
                drawVisualizer();
            }).catch(console.error);
        } else {
            audioEl.pause();
            // Change icon to play
            playBtn.innerHTML = `<svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>`;
            
            // Reset bars when paused
            visualizerBars.forEach(bar => {
                bar.style.height = '10%';
            });
        }
    });

    // Update progress bar
    audioEl.addEventListener('timeupdate', () => {
        const percent = (audioEl.currentTime / audioEl.duration) * 100;
        progressBar.style.width = `${percent}%`;
        timeDisplay.textContent = `${formatTime(audioEl.currentTime)} / ${formatTime(audioEl.duration)}`;
    });

    // Load metadata (duration initially)
    audioEl.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(audioEl.duration)}`;
    });

    // Click to seek
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            audioEl.currentTime = percent * audioEl.duration;
        });
    }

    // Ended event
    audioEl.addEventListener('ended', () => {
        playBtn.innerHTML = `<svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>`;
        progressBar.style.width = '0%';
        visualizerBars.forEach(bar => bar.style.height = '10%');
    });
}
