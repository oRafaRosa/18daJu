document.documentElement.classList.add("js");

const PARTY_DATE = new Date("2026-09-05T14:00:00-03:00");
const JULIA_WHATSAPP = "5511995817225";
const WHATSAPP_MESSAGE =
  "Oi, Júlia! ♡ Confirmo minha presença no seu aniversário de 18 anos no dia 05/09!";
const MUSIC_VOLUME = 12;

const pad = (value) => String(value).padStart(2, "0");

function updateCountdown() {
  const difference = PARTY_DATE.getTime() - Date.now();
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const messageElement = document.getElementById("countdownMessage");

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    if (messageElement) messageElement.textContent = "Chegou o grande dia! ♡";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = pad(days);
  hoursElement.textContent = pad(hours);
  minutesElement.textContent = pad(minutes);
  secondsElement.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const background = document.getElementById("parallaxBackground");
const floatingBows = document.querySelector(".floating-bows");
const heroCard = document.querySelector(".hero-card");
let ticking = false;

function applyScrollMotion() {
  const scrollY = window.scrollY;

  if (background) {
    background.style.transform = `translate3d(0, ${scrollY * 0.13}px, 0)`;
  }

  if (floatingBows) {
    floatingBows.style.transform = `translate3d(0, ${scrollY * -0.035}px, 0)`;
  }

  if (heroCard && scrollY < window.innerHeight * 1.2) {
    const progress = Math.min(scrollY / window.innerHeight, 1);
    heroCard.style.transform = `translate3d(0, ${progress * 22}px, 0) scale(${1 - progress * 0.018})`;
  }

  document.querySelectorAll(".content-section .section-bow").forEach((bow) => {
    const rect = bow.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const distance = (rect.top - center) / window.innerHeight;
    const rotate = Math.max(-10, Math.min(10, distance * -12));
    bow.style.transform = `rotate(${rotate}deg)`;
  });

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(applyScrollMotion);
      ticking = true;
    }
  },
  { passive: true }
);

applyScrollMotion();

const mainRevealCards = Array.from(document.querySelectorAll(".reveal"));
const animationClasses = ["anim-zoom", "anim-left", "anim-right", "anim-soft-rotate"];

mainRevealCards.forEach((element, index) => {
  if (!element.closest(".hero")) {
    element.classList.add(animationClasses[index % animationClasses.length]);
  }
});

const revealElements = document.querySelectorAll(".reveal, .reveal-child");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -28px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.querySelectorAll(".hero .reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  }, 220);
});

const confirmButton = document.getElementById("confirmPresence");

if (confirmButton) {
  confirmButton.href = `https://wa.me/${JULIA_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  confirmButton.target = "_blank";
  confirmButton.rel = "noopener noreferrer";
}

document.querySelectorAll(".red-hood, .basket").forEach((element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("found");
  });
});

/* Player de música via iframe do YouTube. */
const musicToggle = document.getElementById("musicToggle");
const youtubeFrame = document.getElementById("youtubeAudioPlayer");
let musicPlaying = false;

function sendYouTubeCommand(func, args = []) {
  if (!youtubeFrame?.contentWindow) return;

  youtubeFrame.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "*"
  );
}

function updateMusicButton() {
  if (!musicToggle) return;

  musicToggle.classList.toggle("playing", musicPlaying);
  const label = musicToggle.querySelector(".music-label");
  if (label) label.textContent = musicPlaying ? "pausar música" : "tocar música";
  musicToggle.setAttribute("aria-label", musicPlaying ? "Pausar música" : "Tocar música");
}

function prepareMusic() {
  sendYouTubeCommand("setVolume", [MUSIC_VOLUME]);
  sendYouTubeCommand("playVideo");
}

function playMusic() {
  sendYouTubeCommand("unMute");
  sendYouTubeCommand("setVolume", [MUSIC_VOLUME]);
  sendYouTubeCommand("playVideo");

  // Reenvia pouco depois porque Safari pode ignorar o primeiro comando durante a inicialização.
  window.setTimeout(() => {
    sendYouTubeCommand("unMute");
    sendYouTubeCommand("setVolume", [MUSIC_VOLUME]);
    sendYouTubeCommand("playVideo");
  }, 180);
}

function pauseMusic() {
  sendYouTubeCommand("pauseVideo");
}

// O iframe já carrega com autoplay mutado. Depois da inicialização deixamos o volume preparado.
window.setTimeout(prepareMusic, 700);
window.addEventListener("load", () => window.setTimeout(prepareMusic, 300));

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      pauseMusic();
      musicPlaying = false;
    } else {
      playMusic();
      musicPlaying = true;
    }

    updateMusicButton();
  });
}

// Tenta liberar o áudio na primeira interação real do usuário.
function unlockMusic() {
  if (musicPlaying) return;
  playMusic();
  musicPlaying = true;
  updateMusicButton();
}

document.addEventListener("pointerdown", unlockMusic, { once: true, passive: true });
document.addEventListener("touchstart", unlockMusic, { once: true, passive: true });

updateMusicButton();

/* Bloqueio de zoom no mobile, incluindo gestos específicos do Safari/iOS. */
document.addEventListener("gesturestart", (event) => event.preventDefault(), { passive: false });
document.addEventListener("gesturechange", (event) => event.preventDefault(), { passive: false });
document.addEventListener("gestureend", (event) => event.preventDefault(), { passive: false });
document.addEventListener("dblclick", (event) => event.preventDefault(), { passive: false });

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false }
);
