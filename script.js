// ====================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ====================

let currentLineIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let userInteracted = false;
let isMusicPlaying = false;
let confettiAnimationId = null;
let fireworksAnimationId = null;

// Текст для терминала
const terminalLines = [
    {prefix: "C:\\birthday_protocol>", text: " initializing Katy_birthday_protocol", type: "system"},
    {prefix: "", text: " system online ✔", type: "success"},
    {prefix: "", text: " mood: active ✔", type: "success"},
    {prefix: "", text: " mindset: pick-me energy detected ✔", type: "success"},
    {prefix: "", text: " faculty: law ✔", type: "success"},
    {prefix: "", text: " gym_status: queen ✔", type: "success"},
    {prefix: "", text: "", type: "empty", delay: 300},
    {prefix: ">", text: " Today is not a regular day.", type: "comment", delay: 350},
    {prefix: ">", text: " Running special script...", type: "comment", delay: 300}
];

// ====================
// 🖥 WINDOWS TERMINAL
// ====================

// Создание курсора
function createCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.style.display = 'none';
    return cursor;
}

// Создание новой строки
function createNewLine() {
    const lineElement = document.createElement('div');
    lineElement.className = 'terminal-line';
    lineElement.style.animationDelay = `${currentLineIndex * 0.1}s`;
    
    const prefixElement = document.createElement('span');
    prefixElement.className = 'line-prefix';
    prefixElement.textContent = terminalLines[currentLineIndex].prefix;
    
    const textElement = document.createElement('span');
    textElement.className = `line-text ${terminalLines[currentLineIndex].type}`;
    
    lineElement.appendChild(prefixElement);
    lineElement.appendChild(textElement);
    document.getElementById('terminal-content').appendChild(lineElement);
    
    const cursor = createCursor();
    lineElement.appendChild(cursor);
    
    document.getElementById('terminal-content').scrollTop = document.getElementById('terminal-content').scrollHeight;
    
    return {lineElement, textElement, cursor};
}

// Печать символов с движущимся курсором
function typeCharacter() {
    if (!isTyping) return;
    
    if (currentLineIndex >= terminalLines.length) {
        isTyping = false;
        
        if (currentCursor) {
            currentCursor.style.display = 'inline-block';
            currentCursor.style.animation = 'cursor-blink 0.8s infinite';
        }
        
        setTimeout(() => {
            document.querySelector('.terminal-action').classList.add('visible');
        }, 500);
        return;
    }
    
    const lineData = terminalLines[currentLineIndex];
    
    if (currentCharIndex === 0) {
        const elements = createNewLine();
        currentLineElement = elements.lineElement;
        currentTextElement = elements.textElement;
        currentCursor = elements.cursor;
    }
    
    if (lineData.text === "" && currentCharIndex === 0) {
        currentCharIndex = 0;
        currentLineIndex++;
        setTimeout(typeCharacter, lineData.delay || 200);
        return;
    }
    
    if (currentCharIndex < lineData.text.length) {
        currentTextElement.textContent += lineData.text.charAt(currentCharIndex);
        currentCharIndex++;
        
        if (currentCursor) {
            currentCursor.style.display = 'inline-block';
        }
        
        const delay = lineData.delay || (30 + Math.random() * 20);
        setTimeout(typeCharacter, delay);
    } else {
        if (currentCursor) {
            currentCursor.style.display = 'none';
        }
        
        currentLineIndex++;
        currentCharIndex = 0;
        setTimeout(typeCharacter, 200);
    }
}

// ====================
// 🎵 AUDIO MANAGEMENT
// ====================

function initAudio() {
    const bgMusic = document.getElementById('bg-music');
    const fanfare = document.getElementById('fanfare-sound');
    const musicToggle = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const musicControlBtn = document.getElementById('music-control-btn');
    
    // Начальные настройки
    bgMusic.volume = 0.4;
    if (fanfare) fanfare.volume = 0.3;
    volumeSlider.value = 0.4;
    
    // Переключение музыки с панели
    musicToggle.addEventListener('click', toggleMusic);
    
    // Переключение музыки с финального экрана
    if (musicControlBtn) {
        musicControlBtn.addEventListener('click', toggleMusic);
    }
    
    // Контроль громкости
    volumeSlider.addEventListener('input', (e) => {
        const volume = parseFloat(e.target.value);
        bgMusic.volume = volume;
        if (fanfare && !fanfare.paused) fanfare.volume = volume * 0.7;
    });
    
    // Автопауза при скрытии вкладки
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (!bgMusic.paused) bgMusic.pause();
            if (fanfare && !fanfare.paused) fanfare.pause();
        }
    });
}

function toggleMusic() {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicControlBtn = document.getElementById('music-control-btn');
    
    if (bgMusic.paused) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMusicPlaying = true;
                updateMusicButtons(true);
            }).catch(e => console.log("Автовоспроизведение заблокировано"));
        }
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicButtons(false);
    }
}

function updateMusicButtons(isPlaying) {
    const musicToggle = document.getElementById('music-toggle');
    const musicControlBtn = document.getElementById('music-control-btn');
    
    const icon = isPlaying ? '🔊' : '🔇';
    const text = isPlaying ? 'выключить' : 'включить';
    
    if (musicToggle) musicToggle.textContent = icon;
    if (musicControlBtn) {
        musicControlBtn.querySelector('.btn-icon').textContent = icon;
        musicControlBtn.querySelector('.btn-text').textContent = `${text} music`;
    }
}

function startBackgroundMusic() {
    if (!userInteracted) return;
    
    const bgMusic = document.getElementById('bg-music');
    const musicPanel = document.querySelector('.music-panel');
    
    bgMusic.volume = parseFloat(document.getElementById('volume-slider').value);
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            updateMusicButtons(true);
            musicPanel.classList.remove('hidden');
        }).catch(e => {
            console.log("Музыка требует взаимодействия");
            musicPanel.classList.remove('hidden');
        });
    }
}

// ====================
// 🔘 SCREEN TRANSITIONS
// ====================

function showTransitionScreen() {
    const transitionScreen = document.getElementById('transition');
    transitionScreen.classList.add('active');
    
    setTimeout(startBackgroundMusic, 500);
    
    setTimeout(() => {
        transitionScreen.classList.remove('active');
        document.getElementById('scroll-story').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        setTimeout(() => {
            document.getElementById('screen1').classList.add('active');
        }, 300);
    }, 3500);
}

function setupScrollAnimations() {
    const storyScreens = document.querySelectorAll('.story-screen');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                if (entry.target.id === 'screen6') {
                    const button = entry.target.querySelector('.final-button');
                    setTimeout(() => {
                        button.style.opacity = '1';
                        button.style.transform = 'translateY(0) scale(1)';
                    }, 800);
                }
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '0px 0px -10% 0px'
    });
    
    storyScreens.forEach(screen => observer.observe(screen));
}

// ====================
// 🎉 FINALE EFFECTS
// ====================

function showFinale() {
    const scrollStory = document.getElementById('scroll-story');
    scrollStory.style.opacity = '0';
    scrollStory.style.pointerEvents = 'none';
    
    const finaleScreen = document.getElementById('finale');
    finaleScreen.classList.add('active');
    
    playFanfare();
    launchInfiniteConfetti();
    launchInfiniteFireworks();
}

function playFanfare() {
    const fanfare = document.getElementById('fanfare-sound');
    if (fanfare) {
        fanfare.currentTime = 0;
        fanfare.volume = 0.3;
        fanfare.play().catch(e => console.log("Фанфары требуют взаимодействия"));
        
        // Повторять фанфары каждые 15 секунд
        setInterval(() => {
            if (!document.hidden && fanfare.paused) {
                fanfare.currentTime = 0;
                fanfare.play().catch(() => {});
            }
        }, 15000);
    }
}

// 🎊 БЕСКОНЕЧНЫЕ КОНФЕТТИ
function launchInfiniteConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#FF6B8B', '#FFCC00', '#00FFCC', '#9D4EDD', '#4CC9F0', '#FF9500', '#00FF00', '#FF00FF'];
    
    class ConfettiParticle {
        constructor() {
            this.reset(true);
        }
        
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * -canvas.height : -20;
            this.size = Math.random() * 12 + 6;
            this.speed = Math.random() * 3 + 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 8 - 4;
            this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
            this.wobble = Math.random() * 3;
            this.wobbleSpeed = Math.random() * 0.03 + 0.02;
            this.oscillation = Math.random() * Math.PI * 2;
            this.alpha = 1;
        }
        
        update() {
            this.y += this.speed;
            this.oscillation += this.wobbleSpeed;
            this.x += Math.sin(this.oscillation) * this.wobble;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Добавляем блик
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(-this.size/4, -this.size/4, this.size/4, 0, Math.PI * 2);
                ctx.fill();
            } else {
                const width = this.size;
                const height = this.size * 0.6;
                ctx.fillRect(-width/2, -height/2, width, height);
                
                // Узор на прямоугольнике
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(-width/3, -height/3, width/1.5, height/1.5);
            }
            
            ctx.restore();
        }
    }
    
    // Создаем 250 частиц
    for (let i = 0; i < 250; i++) {
        particles.push(new ConfettiParticle());
    }
    
    function animateConfetti() {
        // Полупрозрачный фон для эффекта следа
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    }
    
    animateConfetti();
}

// 🎆 БЕСКОНЕЧНЫЕ ФЕЙЕРВЕРКИ
function launchInfiniteFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fireworks = [];
    const explosionColors = [
        ['#FF6B8B', '#FFCC00'],
        ['#00FFCC', '#4CC9F0'],
        ['#9D4EDD', '#FF00FF'],
        ['#FF9500', '#FFFF00'],
        ['#00FF00', '#00FFFF']
    ];
    
    class Firework {
        constructor() {
            this.reset();
            this.sparks = [];
            this.trail = [];
            this.explosionType = Math.floor(Math.random() * 3);
        }
        
        reset() {
            this.x = Math.random() * (canvas.width - 200) + 100;
            this.y = canvas.height + 50;
            this.targetY = Math.random() * (canvas.height * 0.4) + 100;
            this.speed = Math.random() * 5 + 8;
            this.size = Math.random() * 4 + 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
            this.exploded = false;
            this.explosionSize = Math.random() * 80 + 120;
            this.explosionColor = explosionColors[Math.floor(Math.random() * explosionColors.length)];
            this.trail = [];
            this.sparks = [];
            this.sparkCount = Math.random() * 80 + 40;
        }
        
        update() {
            if (!this.exploded) {
                this.trail.push({x: this.x, y: this.y});
                if (this.trail.length > 8) this.trail.shift();
                
                this.y -= this.speed;
                
                if (this.y <= this.targetY) {
                    this.explode();
                }
            } else {
                for (let i = this.sparks.length - 1; i >= 0; i--) {
                    const spark = this.sparks[i];
                    spark.y += spark.speed;
                    spark.x += spark.dx;
                    spark.speed += 0.15;
                    spark.alpha -= 0.015;
                    spark.size *= 0.98;
                    
                    if (spark.alpha <= 0 || spark.size <= 0.5) {
                        this.sparks.splice(i, 1);
                    }
                }
                
                if (this.sparks.length === 0) {
                    setTimeout(() => this.reset(), Math.random() * 2000);
                }
            }
        }
        
        explode() {
            this.exploded = true;
            
            for (let i = 0; i < this.sparkCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                const colorIndex = Math.floor(Math.random() * this.explosionColor.length);
                
                this.sparks.push({
                    x: this.x,
                    y: this.y,
                    dx: Math.cos(angle) * speed,
                    dy: Math.sin(angle) * speed,
                    speed: Math.random() * 3 + 1,
                    size: Math.random() * 5 + 2,
                    color: this.explosionColor[colorIndex],
                    alpha: 1,
                    gravity: 0.1,
                    friction: 0.98
                });
            }
        }
        
        draw() {
            if (!this.exploded) {
                // Рисуем след
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                for (let i = 1; i < this.trail.length; i++) {
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                }
                ctx.stroke();
                
                // Рисуем огонек
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Свечение
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                // Рисуем искры
                this.sparks.forEach(spark => {
                    ctx.globalAlpha = spark.alpha;
                    ctx.fillStyle = spark.color;
                    ctx.beginPath();
                    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Свечение искр
                    ctx.shadowColor = spark.color;
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                });
                ctx.globalAlpha = 1;
            }
        }
    }
    
    // Создаем начальные фейерверки
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            fireworks.push(new Firework());
        }, i * 800);
    }
    
    // Добавляем новые фейерверки
    setInterval(() => {
        if (fireworks.length < 6 && Math.random() > 0.3) {
            fireworks.push(new Firework());
        }
    }, 1200);
    
    function animateFireworks() {
        // Полупрозрачный фон
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        fireworks.forEach(firework => {
            firework.update();
            firework.draw();
        });
        
        fireworksAnimationId = requestAnimationFrame(animateFireworks);
    }
    
    animateFireworks();
}

// ====================
// 🔄 RESTART PROTOCOL
// ====================

function restartProtocol() {
    // Останавливаем анимации
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    if (fireworksAnimationId) {
        cancelAnimationFrame(fireworksAnimationId);
        fireworksAnimationId = null;
    }
    
    // Останавливаем аудио
    const bgMusic = document.getElementById('bg-music');
    const fanfare = document.getElementById('fanfare-sound');
    bgMusic.pause();
    bgMusic.currentTime = 0;
    if (fanfare) {
        fanfare.pause();
        fanfare.currentTime = 0;
    }
    isMusicPlaying = false;
    updateMusicButtons(false);
    
    // Скрываем финальный экран
    const finaleScreen = document.getElementById('finale');
    finaleScreen.classList.remove('active');
    
    // Очищаем canvas
    const confettiCanvas = document.getElementById('confetti-canvas');
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    if (confettiCanvas) {
        const ctx = confettiCanvas.getContext('2d');
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
    if (fireworksCanvas) {
        const ctx = fireworksCanvas.getContext('2d');
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }
    
    // Восстанавливаем скролл-историю
    const scrollStory = document.getElementById('scroll-story');
    scrollStory.style.opacity = '1';
    scrollStory.style.pointerEvents = 'auto';
    scrollStory.style.transition = 'none';
    
    // Сбрасываем экраны истории
    document.querySelectorAll('.story-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Восстанавливаем терминал
    const terminal = document.getElementById('terminal');
    terminal.classList.add('active');
    terminal.style.opacity = '1';
    terminal.style.transform = 'translateY(0)';
    terminal.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // Очищаем терминал
    const terminalContent = document.getElementById('terminal-content');
    terminalContent.innerHTML = '';
    document.querySelector('.terminal-action').classList.remove('visible');
    
    // Сбрасываем переменные
    currentLineIndex = 0;
    currentCharIndex = 0;
    isTyping = true;
    currentLineElement = null;
    currentTextElement = null;
    currentCursor = null;
    
    // Прокручиваем наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Перезапускаем печать
    setTimeout(() => {
        typeCharacter();
        // Скрываем панель управления музыкой
        document.querySelector('.music-panel').classList.add('hidden');
    }, 1000);
    
    // Сбрасываем флаг взаимодействия
    userInteracted = false;
}

// ====================
// 📱 RESPONSIVE HANDLING
// ====================

function handleResize() {
    const canvases = ['confetti-canvas', 'fireworks-canvas'];
    canvases.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
}

// ====================
// 🚀 INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация аудио
    initAudio();
    
    // Запуск терминала
    setTimeout(() => {
        typeCharacter();
    }, 800);
    
    // Кнопка запуска протокола
    document.getElementById('run-button').addEventListener('click', () => {
        if (isTyping) return;
        
        userInteracted = true;
        const terminal = document.getElementById('terminal');
        terminal.style.opacity = '0';
        terminal.style.transform = 'translateY(-30px)';
        
        setTimeout(() => {
            terminal.classList.remove('active');
            showTransitionScreen();
        }, 1000);
    });
    
    // Кнопка финализации
    document.getElementById('finalize-button').addEventListener('click', showFinale);
    
    // Кнопка перезапуска
    document.getElementById('replay-button').addEventListener('click', restartProtocol);
    
    // Настройка скролл-анимаций
    setupScrollAnimations();
    
    // Обработка ресайза
    window.addEventListener('resize', handleResize);
    
    // Предзагрузка изображений
    window.addEventListener('load', () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.loading = 'eager';
        });
    });

});
