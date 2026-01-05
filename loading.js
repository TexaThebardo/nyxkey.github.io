let progress = 0;
const text = document.getElementById("progress-text");
const circle = document.getElementById("progress-circle");
const loading = document.getElementById("loading-screen");
const menu = document.getElementById("menu");

const max = 377;

function simulateLoad() {
    // Simulación basada en rendimiento del navegador
    const perf = performance.now();
    const increment = Math.random() * (perf % 5 + 1);

    progress += increment;
    if (progress > 100) progress = 100;

    text.textContent = `${Math.floor(progress)}%`;
    circle.style.strokeDashoffset = max - (max * progress) / 100;

    if (progress >= 100) {
        setTimeout(() => {
            loading.style.opacity = "0";
            setTimeout(() => {
                loading.style.display = "none";
                menu.classList.remove("hidden");
            }, 800);
        }, 400);
        return;
    }

    requestAnimationFrame(simulateLoad);
}

simulateLoad();
