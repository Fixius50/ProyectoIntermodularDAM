// Interacción de Pájaros (Feedback Visual/Audio simulado)
const birds = document.querySelectorAll('.bird-node');
const feedbackLayer = document.getElementById('feedback-layer');

// Haptic feedback simulado
function simulateHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(50); // Vibración ultra corta de UI
    }
}

function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart';
    heart.style.left = `${x - 20}px`;
    heart.style.top = `${y - 20}px`;

    feedbackLayer.appendChild(heart);

    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

birds.forEach(bird => {
    bird.addEventListener('click', (e) => {
        simulateHaptic();
        spawnHeart(e.clientX, e.clientY);

        // Efecto visual al clickar (pequeño rebote)
        bird.style.transform = 'scale(0.9)';
        setTimeout(() => {
            bird.style.transform = '';
        }, 150);

        // Aquí sonaría el canto real vía Nuthatch API
        console.log("Canto reproducido!");
    });
});

// Navegación
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        simulateHaptic();
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');
    });
});

// Botón Expedición
function triggerExplore() {
    simulateHaptic();
    const btn = document.querySelector('.primary-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>🛫 Buscando...</span>';
    btn.style.transform = 'scale(0.95)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.transform = '';
    }, 800);
}
