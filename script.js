// Datos del álbum
const albumData = {
    photos: [
        'assets/pag1.jpeg',
        'assets/pag2.jpeg', 
        'assets/pag3.jpeg',
        'assets/pag4.jpeg'
    ],
    captions: [
        "Isa, sé que quizá estés mejor sin mí y que ni siquiera debería estar aquí, pero no puedo sacarte de la mente. Por más que lo intento, siempre estás tú en mis pensamientos y mis ojos no dejan de mirarte.",
        "Tal vez sea amor de verdad, o quizá no lo sea —no lo sé—, pero me haces muchísima falta. Sé que no es el momento adecuado, pero necesitaba decírtelo con la sinceridad de siempre.",
        "Acepto mi error; quizás me dejé llevar por lo que me dijeron de ti y eso estuvo mal. No sabes cuánto sufrí cuando escuché esas cosas... discúlpame de verdad.",
        "Dime si te gustaría continuar con esta loca historia o si prefieres que terminemos aquí; respetaré cualquier decisión que tomes. Piénsalo bien, y gracias por leerme."
    ]
};

// Variables globales
let currentPhotoIndex = 0;
let isPlaying = false;
let playInterval = null;
let typewriterTimeout = null;

// Elementos DOM
const envelope = document.getElementById('envelope');
const album = document.getElementById('album');
const currentPhoto = document.getElementById('currentPhoto');
const photoCaption = document.getElementById('photoCaption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playBtn = document.getElementById('playBtn');
const dots = document.querySelectorAll('.dot');
const heartsContainer = document.querySelector('.hearts-container');
const sparklesContainer = document.querySelector('.sparkles-container');
const particlesBackground = document.querySelector('.particles');
const appLoader = document.getElementById('appLoader');
const finalButtons = document.getElementById('finalButtons');
const togetherForeverBtn = document.getElementById('togetherForever');
const endStoryBtn = document.getElementById('endStory');
const puzzleOverlay = document.getElementById('puzzleOverlay');
const puzzleMessage = document.getElementById('puzzleMessage');
const farewellOverlay = document.getElementById('farewellOverlay');
const farewellMessage = document.getElementById('farewellMessage');
const backToStartBtn = document.getElementById('backToStartBtn');
// Música DOM refs
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicVolume = document.getElementById('musicVolume');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar loader mientras se precarga la primera imagen
    if (appLoader) {
        appLoader.classList.remove('hidden');
    }
    // Volumen inicial suave
    if (bgMusic && musicVolume) {
        bgMusic.volume = 0.2;
        musicVolume.value = '0.2';
    }
    initializeApp();
});

function initializeApp() {
    // Event listeners
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
        // Glow con posición del mouse
        const envelopeContainer = document.querySelector('.envelope-container');
        if (envelopeContainer) {
            envelopeContainer.addEventListener('mousemove', handleEnvelopeMouseMove);
        }
        // Primer interacción para intentar reproducir música
        envelope.addEventListener('click', tryPlayMusicOnce, { once: true });
    }
    if (prevBtn) prevBtn.addEventListener('click', () => changePhoto(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePhoto(1));
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToPhoto(index));
    });
    
    // Botones finales
    if (togetherForeverBtn) {
        togetherForeverBtn.addEventListener('click', startPuzzleSequence);
        togetherForeverBtn.addEventListener('click', tryPlayMusicOnce, { once: true });
    }
    
    if (endStoryBtn) {
        endStoryBtn.addEventListener('click', handleEndStory);
        endStoryBtn.addEventListener('click', tryPlayMusicOnce, { once: true });
    }
    if (backToStartBtn) {
        backToStartBtn.addEventListener('click', resetExperience);
    }
    // Música UI
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    if (musicVolume) {
        musicVolume.addEventListener('input', (e) => setMusicVolume(e.target.value));
    }
    
    // Efectos de corazones y partículas
    createFloatingHearts();
    createBackgroundParticles();

    // Precargar primera imagen y ocultar loader
    preloadImage(albumData.photos[0]).then(() => hideLoader());
}

function handleEnvelopeMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const body = e.currentTarget.querySelector('.envelope-body');
    if (body) {
        body.style.setProperty('--mouse-x', x + 'px');
        body.style.setProperty('--mouse-y', y + 'px');
    }
}

function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });
}

function hideLoader() {
    if (appLoader) {
        // Pequeño delay para suavidad
        setTimeout(() => appLoader.classList.add('hidden'), 200);
    }
}

function openEnvelope() {
    // Animación del sobre
    envelope.classList.add('opened');
    
    // Efectos visuales
    createSparkles();
    createHearts();
    
    // Mostrar álbum después de la animación
    setTimeout(() => {
        album.classList.remove('hidden');
        album.classList.add('show');
        
        // Scroll suave al álbum
        album.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Iniciar reproducción automática
        setTimeout(() => {
            togglePlay();
        }, 2000);
        
        hideLoader();
    }, 1000);
}

function changePhoto(direction) {
    currentPhotoIndex += direction;
    
    // Loop circular
    if (currentPhotoIndex >= albumData.photos.length) {
        currentPhotoIndex = 0;
    } else if (currentPhotoIndex < 0) {
        currentPhotoIndex = albumData.photos.length - 1;
    }
    
    updatePhoto();
    updateDots();
}

function goToPhoto(index) {
    currentPhotoIndex = index;
    updatePhoto();
    updateDots();
}

function updatePhoto() {
    // Cambiar imagen con efecto
    currentPhoto.style.transform = 'scale(0.8)';
    currentPhoto.style.opacity = '0';
    
    setTimeout(() => {
        currentPhoto.src = albumData.photos[currentPhotoIndex];
        currentPhoto.style.transform = 'scale(1)';
        currentPhoto.style.opacity = '1';
        
        // Efecto typewriter en el texto
        typewriterEffect(albumData.captions[currentPhotoIndex]);
        
        // Mostrar/ocultar botones finales en la última imagen
        if (finalButtons) {
            if (currentPhotoIndex === albumData.photos.length - 1) {
                finalButtons.classList.remove('hidden');
            } else {
                finalButtons.classList.add('hidden');
            }
        }
    }, 300);
}

function typewriterEffect(text) {
    // Limpiar timeout anterior
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
    
    photoCaption.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            photoCaption.textContent += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(type, 50);
        }
    }
    
    type();
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPhotoIndex);
    });
}

function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playBtn.textContent = '⏸';
        playBtn.classList.add('playing');
        startAutoPlay();
    } else {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
        stopAutoPlay();
    }
}

function startAutoPlay() {
    playInterval = setInterval(() => {
        changePhoto(1);
    }, 3000);
}

function stopAutoPlay() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
}

function createSparkles() {
    const sparkleCount = 20;
    
    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Posición aleatoria alrededor del sobre
            const rect = envelope.getBoundingClientRect();
            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 200;
            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 200;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            sparklesContainer.appendChild(sparkle);
            
            // Remover después de la animación
            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        }, i * 50);
    }
}

function createHearts() {
    const heartCount = 15;
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            
            // Posición aleatoria en la parte inferior
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.bottom = '-20px';
            
            // Tamaño aleatorio
            const size = 15 + Math.random() * 10;
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';
            
            heartsContainer.appendChild(heart);
            
            // Remover después de la animación
            setTimeout(() => {
                heart.remove();
            }, 6000);
        }, i * 200);
    }
}

function createFloatingHearts() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de probabilidad
            const heart = document.createElement('div');
            heart.className = 'heart';
            
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.bottom = '-20px';
            
            const size = 10 + Math.random() * 15;
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';
            
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 6000);
        }
    }, 2000);
}

function createBackgroundParticles() {
    if (!particlesBackground) return;
    const total = 40;
    for (let i = 0; i < total; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 2 + Math.random() * 6;
        const left = Math.random() * 100; // %
        const duration = 6 + Math.random() * 12; // s
        const delay = Math.random() * 6; // s
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = left + '%';
        p.style.bottom = '-10px';
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = delay + 's';
        particlesBackground.appendChild(p);
    }
}

function startPuzzleSequence() {
    // Mostrar overlay
    if (!puzzleOverlay) return;
    puzzleOverlay.classList.remove('hidden');
    // Reiniciar estado piezas
    const pieces = puzzleOverlay.querySelectorAll('.puzzle-piece');
    pieces.forEach(p => {
        p.classList.remove('in');
        // Reinicio de transición
        // Forzar reflow
        // eslint-disable-next-line no-unused-expressions
        p.offsetHeight;
    });
    // Secuencia de entrada
    pieces.forEach((p, i) => {
        setTimeout(() => p.classList.add('in'), 300 + i * 300);
    });
    // Mostrar mensaje final
    if (puzzleMessage) {
        puzzleMessage.classList.add('hidden');
        puzzleMessage.classList.remove('show');
        setTimeout(() => {
            puzzleMessage.classList.remove('hidden');
            puzzleMessage.classList.add('show');
            createHearts();
        }, 300 + pieces.length * 300 + 400);
        // Cerrar automáticamente el overlay después de 3.5s adicionales
        setTimeout(() => {
            closePuzzleOverlay();
        }, 300 + pieces.length * 300 + 3500);
    }
}

function closePuzzleOverlay() {
    if (!puzzleOverlay) return;
    puzzleOverlay.classList.add('hidden');
}

function handleEndStory() {
    // Animar desaparición del contenido principal
    const main = document.querySelector('main');
    const particles = document.querySelector('.particles');
    const hearts = document.querySelector('.hearts-container');
    const sparkles = document.querySelector('.sparkles-container');
    [main, particles, hearts, sparkles].forEach(el => {
        if (el) el.classList.add('fade-out-all');
    });
    // Fade-out de música si está sonando
    if (bgMusic && !bgMusic.paused) {
        fadeOutAudio(bgMusic, 1200, () => {
            bgMusic.pause();
            if (musicToggle) musicToggle.textContent = '♫';
        });
    }
    // Tras la animación, mostrar overlay de despedida
    setTimeout(() => {
        if (farewellOverlay) {
            farewellOverlay.classList.remove('hidden');
            farewellOverlay.classList.add('show');
            setTimeout(() => {
                if (farewellMessage) farewellMessage.classList.add('show');
            }, 300);
        }
    }, 900);
}

function resetExperience() {
    // Ocultar overlay despedida
    if (farewellOverlay) {
        farewellOverlay.classList.add('hidden');
        farewellOverlay.classList.remove('show');
        if (farewellMessage) farewellMessage.classList.remove('show');
    }
    // Mostrar contenido de nuevo
    const main = document.querySelector('main');
    const particles = document.querySelector('.particles');
    const hearts = document.querySelector('.hearts-container');
    const sparkles = document.querySelector('.sparkles-container');
    [main, particles, hearts, sparkles].forEach(el => {
        if (el) el.classList.remove('fade-out-all');
    });
    // Resetear estado del álbum y sobre
    currentPhotoIndex = 0;
    stopAutoPlay();
    if (playBtn) playBtn.textContent = '▶';
    if (album) {
        album.classList.add('hidden');
        album.classList.remove('show');
    }
    if (envelope) {
        envelope.classList.remove('opened');
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updatePhoto();
    updateDots();
}

// Música helpers
function tryPlayMusicOnce() {
    if (!bgMusic) return;
    const target = parseFloat(musicVolume?.value || '0.4') || 0.4;
    // Inicia bajo y hace fade-in suave
    bgMusic.volume = Math.min(0.08, target);
    bgMusic.play().then(() => {
        if (musicToggle) musicToggle.textContent = '⏸';
        fadeInAudio(bgMusic, target, 1600);
    }).catch(() => {/* silencioso por políticas del navegador */});
}

function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
        const target = parseFloat(musicVolume?.value || '0.4') || 0.4;
        bgMusic.volume = Math.min(bgMusic.volume, 0.08);
        bgMusic.play().then(() => {
            if (musicToggle) musicToggle.textContent = '⏸';
            fadeInAudio(bgMusic, target, 1200);
        }).catch(() => {});
    } else {
        fadeOutAudio(bgMusic, 500, () => {
            bgMusic.pause();
            if (musicToggle) musicToggle.textContent = '♫';
        });
    }
}

function setMusicVolume(v) {
    if (!bgMusic) return;
    bgMusic.volume = parseFloat(v);
}

function fadeInAudio(audioEl, targetVolume, durationMs) {
    targetVolume = Math.max(0, Math.min(1, targetVolume));
    const start = audioEl.volume || 0;
    const delta = targetVolume - start;
    if (delta <= 0.001) return;
    const startTime = performance.now();
    function tick(now) {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        audioEl.volume = start + delta * eased;
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function fadeOutAudio(audioEl, durationMs, onDone) {
    const start = audioEl.volume || 0;
    if (start <= 0.001) { if (onDone) onDone(); return; }
    const startTime = performance.now();
    function tick(now) {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = Math.pow(t, 3);
        audioEl.volume = start * (1 - eased);
        if (t < 1) requestAnimationFrame(tick); else { if (onDone) onDone(); }
    }
    requestAnimationFrame(tick);
}

// Pausar reproducción automática al hacer hover sobre controles
[prevBtn, nextBtn, playBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        if (isPlaying) {
            stopAutoPlay();
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        if (isPlaying) {
            startAutoPlay();
        }
    });
});

// Efectos de teclado
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            changePhoto(-1);
            break;
        case 'ArrowRight':
            changePhoto(1);
            break;
        case ' ':
            e.preventDefault();
            togglePlay();
            break;
    }
});


