export function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Matrix characters
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+-=[]{}|;:,.<>?/\\~`';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Array of drops - one per column
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100; // Start at random negative y positions so they don't all fall at once
    }
    
    function draw() {
        // Black BG with opacity for trail effect
        ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0'; // Green text
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Randomly use cyan or purple for some characters to match theme
            const colorRng = Math.random();
            if(colorRng > 0.98) ctx.fillStyle = '#b829dd'; // Cyber Purple
            else if(colorRng > 0.95) ctx.fillStyle = '#00f0ff'; // Cyber Cyan
            else ctx.fillStyle = 'rgba(0, 240, 255, 0.3)'; // Faded cyan
            
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Send drop to top randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    setInterval(draw, 50);
}

export function initNavigation() {
    // Mobile Menu Toggle
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('mobileMenu');
        if(menu) menu.classList.toggle('hidden');
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Hash routing for SPA logic is different
            
            // Only affect layout anchors
            const target = document.querySelector(href);
            if (target && !href.startsWith('#/')) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                document.getElementById('mobileMenu').classList.add('hidden');
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if(!navbar) return;
        
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'border-b', 'border-cyber-cyan');
            navbar.style.background = 'rgba(19, 19, 31, 0.95)';
        } else {
            navbar.classList.remove('shadow-lg', 'border-b', 'border-cyber-cyan');
            navbar.style.background = 'rgba(19, 19, 31, 0.7)';
        }
    });
}

export function initTypewriter() {
    const phrases = [
        "Demystifying the digital underground.",
        "Privacy by default, not as an afterthought.",
        "Learning in public. Expanding the collective.",
        "System online // Access granted.",
    ];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentText = '';
    let isDeleting = false;
    const typeElement = document.getElementById('typewriter');
    if (!typeElement) return;

    function type() {
        const fullPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = fullPhrase.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            currentText = fullPhrase.substring(0, letterIndex + 1);
            letterIndex++;
        }
        
        typeElement.textContent = currentText;
        
        let typingSpeed = 100;
        if (isDeleting) typingSpeed /= 2;
        
        if (!isDeleting && currentText === fullPhrase) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before new phrase
        }
        
        setTimeout(type, typingSpeed + (Math.random() * 50));
    }
    
    // Start typing
    setTimeout(type, 1000);
}

export function initTabs() {
    window.switchTab = function(tab) {
        ['audio', 'video', 'live'].forEach(t => {
            const el = document.getElementById(`view-${t}`);
            if(el) el.classList.add('hidden');
            
            const btn = document.getElementById(`tab-${t}`);
            if(btn) {
                btn.className = 'px-4 py-2 rounded font-mono text-sm border transition-all';
                btn.classList.add('border-gray-700', 'text-gray-400');
            }
        });
        
        const targetView = document.getElementById(`view-${tab}`);
        if(targetView) targetView.classList.remove('hidden');
        
        const activeBtn = document.getElementById(`tab-${tab}`);
        if(activeBtn) {
            if(tab === 'audio') {
                activeBtn.className = 'px-4 py-2 rounded font-mono text-sm border transition-all animate-glow bg-cyber-cyan text-dark-900 border-cyber-cyan';
            } else if (tab === 'video') {
                activeBtn.className = 'px-4 py-2 rounded font-mono text-sm border transition-all animate-glow bg-cyber-purple text-white border-cyber-purple';
            } else if (tab === 'live') {
                activeBtn.className = 'px-4 py-2 rounded font-mono text-sm border transition-all animate-glow bg-cyber-magenta text-white border-cyber-magenta';
            }
        }
    }
}
