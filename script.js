document.documentElement.classList.add("js");

const PARTY_DATE = new Date("2026-09-05T14:00:00-03:00");
const JULIA_WHATSAPP = "5511995817225";
const WHATSAPP_MESSAGE =
  "Oi, Júlia! ♡ Confirmo minha presença no seu aniversário de 18 anos no dia 05/09!";

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
let ticking = false;

function applyParallax() {
  if (!background) return;
  const offset = window.scrollY * 0.13;
  background.style.transform = `translate3d(0, ${offset}px, 0)`;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  },
  { passive: true }
);

applyParallax();

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
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px",
    }
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
  }, 250);
});

const confirmButton = document.getElementById("confirmPresence");

if (confirmButton) {
  confirmButton.href = `https://wa.me/${JULIA_WHATSAPP}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;
  confirmButton.target = "_blank";
  confirmButton.rel = "noopener noreferrer";
}

document.querySelectorAll(".red-hood, .basket").forEach((element) => {
  element.addEventListener("click", () => {
    element.classList.toggle("found");
  });
});
