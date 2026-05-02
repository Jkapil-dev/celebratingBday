const landingScreen = document.getElementById("landingScreen");
const celebrationScreen = document.getElementById("celebrationScreen");
const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");
const soundToggle = document.getElementById("soundToggle");
const friendName = document.getElementById("friendName");
const birthdayTitle = document.getElementById("birthdayTitle");
const cakeStage = document.getElementById("cakeStage");
const messageCard = document.getElementById("messageCard");
const typedMessage = document.getElementById("typedMessage");
const heartsLayer = document.getElementById("heartsLayer");
const particlesLayer = document.getElementById("particlesLayer");
const confettiLayer = document.getElementById("confettiLayer");
const balloonLayer = document.getElementById("balloonLayer");
const sparkleLayer = document.getElementById("sparkleLayer");

const params = new URLSearchParams(window.location.search);
const nameFromUrl = params.get("name");
const displayName = cleanName(nameFromUrl) || "Lovely";
const birthdayMessage = `Wishing you endless happiness, laughter, and success, ${displayName}. May this year feel gentle, bright, and full of little moments that make your heart smile.`;

const confettiColors = ["#ffb6d2", "#ffd6c2", "#e6d5ff", "#fff0a8", "#ffffff"];
const balloonColors = ["#ffc0d8", "#ffd7c7", "#dfccff", "#fff0f5", "#ffabc9"];
let audioContext;
let masterGain;
let musicTimer;
let isMuted = false;
let celebrationRunning = false;
let midnightTriggeredToday = "";

friendName.textContent = displayName;
birthdayTitle.textContent = `Happy Birthday, ${displayName}`;

createAmbientHearts();
createParticles();
checkMidnightTrigger();
window.setInterval(checkMidnightTrigger, 1000);

startButton.addEventListener("click", () => startCelebration(true));
replayButton.addEventListener("click", () => startCelebration(true));
soundToggle.addEventListener("click", toggleSound);

function cleanName(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 28);
}

function startCelebration(allowSound) {
  if (celebrationRunning) {
    resetCelebration();
  }

  celebrationRunning = true;
  landingScreen.classList.remove("is-visible");
  celebrationScreen.classList.add("is-visible");
  typedMessage.textContent = "";
  typedMessage.classList.remove("is-done");
  messageCard.classList.remove("is-active");

  window.setTimeout(() => {
    cakeStage.classList.add("is-active");
    launchBalloons();
    launchConfetti();
    burstSparkles();
  }, 250);

  window.setTimeout(() => {
    messageCard.classList.add("is-active");
    typeMessage(birthdayMessage);
  }, 3400);

  if (allowSound && !isMuted) {
    startMusic();
  }
}

function resetCelebration() {
  clearLayer(confettiLayer);
  clearLayer(balloonLayer);
  clearLayer(sparkleLayer);
  cakeStage.classList.remove("is-active");
  messageCard.classList.remove("is-active");
  typedMessage.textContent = "";
  typedMessage.classList.remove("is-done");
}

function launchBalloons() {
  const total = window.innerWidth < 640 ? 14 : 24;

  for (let i = 0; i < total; i += 1) {
    window.setTimeout(() => {
      const balloon = document.createElement("span");
      balloon.className = "balloon";
      balloon.style.left = `${random(3, 96)}%`;
      balloon.style.setProperty("--duration", `${random(6, 10)}s`);
      balloon.style.setProperty("--drift", `${random(-60, 60)}px`);
      balloon.style.setProperty("--balloon-color", balloonColors[i % balloonColors.length]);
      balloonLayer.appendChild(balloon);
      removeAfter(balloon, 10500);
    }, i * 130);
  }
}

function launchConfetti() {
  const total = window.innerWidth < 640 ? 70 : 130;

  for (let i = 0; i < total; i += 1) {
    window.setTimeout(() => {
      const confetti = document.createElement("span");
      confetti.className = "confetti";
      confetti.style.left = `${random(0, 100)}%`;
      confetti.style.setProperty("--duration", `${random(3.5, 6.6)}s`);
      confetti.style.setProperty("--drift", `${random(-80, 80)}px`);
      confetti.style.setProperty("--confetti-color", confettiColors[i % confettiColors.length]);
      confetti.style.width = `${random(5, 10)}px`;
      confetti.style.height = `${random(8, 16)}px`;
      confettiLayer.appendChild(confetti);
      removeAfter(confetti, 7000);
    }, i * 24);
  }
}

function burstSparkles() {
  const bursts = window.innerWidth < 640 ? 28 : 46;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.46;

  for (let i = 0; i < bursts; i += 1) {
    window.setTimeout(() => {
      const sparkle = document.createElement("span");
      const angle = random(0, Math.PI * 2);
      const distance = random(42, window.innerWidth < 640 ? 150 : 230);
      sparkle.className = "sparkle";
      sparkle.style.left = `${centerX + random(-80, 80)}px`;
      sparkle.style.top = `${centerY + random(-45, 45)}px`;
      sparkle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      sparkle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      sparkleLayer.appendChild(sparkle);
      removeAfter(sparkle, 1100);
    }, i * 42);
  }
}

function typeMessage(message) {
  let index = 0;
  const speed = window.innerWidth < 640 ? 34 : 28;

  function typeNext() {
    typedMessage.textContent = message.slice(0, index);
    index += 1;

    if (index <= message.length) {
      window.setTimeout(typeNext, speed);
    } else {
      typedMessage.classList.add("is-done");
      celebrationRunning = false;
    }
  }

  typeNext();
}

function createAmbientHearts() {
  const total = 18;

  for (let i = 0; i < total; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "♥";
    heart.style.left = `${random(0, 100)}%`;
    heart.style.animationDelay = `${random(-12, 0)}s`;
    heart.style.setProperty("--duration", `${random(10, 17)}s`);
    heart.style.setProperty("--drift", `${random(-70, 70)}px`);
    heartsLayer.appendChild(heart);
  }
}

function createParticles() {
  const total = 26;

  for (let i = 0; i < total; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${random(3, 97)}%`;
    particle.style.top = `${random(4, 96)}%`;
    particle.style.animationDelay = `${random(-6, 0)}s`;
    particle.style.setProperty("--duration", `${random(3, 7)}s`);
    particlesLayer.appendChild(particle);
  }
}

function checkMidnightTrigger() {
  const now = new Date();
  const today = now.toDateString();
  const isMidnight = now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() >= 0;

  if (isMidnight && midnightTriggeredToday !== today) {
    midnightTriggeredToday = today;
    startCelebration(false);
  }
}

function toggleSound() {
  isMuted = !isMuted;
  soundToggle.setAttribute("aria-pressed", String(isMuted));
  soundToggle.setAttribute("aria-label", isMuted ? "Unmute birthday music" : "Mute birthday music");
  soundToggle.querySelector(".sound-icon").textContent = isMuted ? "×" : "♪";

  if (masterGain) {
    masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.16, audioContext.currentTime, 0.03);
  }

  if (!isMuted && celebrationScreen.classList.contains("is-visible")) {
    startMusic();
  }
}

function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = isMuted ? 0 : 0.16;
    masterGain.connect(audioContext.destination);
  }

  audioContext.resume();
  window.clearTimeout(musicTimer);
  playBirthdayTune();
}

function playBirthdayTune() {
  const notes = [
    ["G4", 0.32], ["G4", 0.32], ["A4", 0.64], ["G4", 0.64], ["C5", 0.64], ["B4", 1.0],
    ["G4", 0.32], ["G4", 0.32], ["A4", 0.64], ["G4", 0.64], ["D5", 0.64], ["C5", 1.0],
    ["G4", 0.32], ["G4", 0.32], ["G5", 0.64], ["E5", 0.64], ["C5", 0.64], ["B4", 0.64], ["A4", 1.0],
    ["F5", 0.32], ["F5", 0.32], ["E5", 0.64], ["C5", 0.64], ["D5", 0.64], ["C5", 1.1]
  ];
  const startAt = audioContext.currentTime + 0.06;
  let cursor = 0;

  notes.forEach(([note, duration]) => {
    scheduleTone(noteToFrequency(note), startAt + cursor, duration);
    cursor += duration * 0.9;
  });

  musicTimer = window.setTimeout(() => {
    if (!isMuted && celebrationScreen.classList.contains("is-visible")) {
      playBirthdayTune();
    }
  }, cursor * 1000 + 900);
}

function scheduleTone(frequency, startAt, duration) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.5, startAt + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function noteToFrequency(note) {
  const noteMap = {
    C: -9,
    "C#": -8,
    D: -7,
    "D#": -6,
    E: -5,
    F: -4,
    "F#": -3,
    G: -2,
    "G#": -1,
    A: 0,
    "A#": 1,
    B: 2
  };
  const [, pitch, octave] = note.match(/^([A-G]#?)(\d)$/);
  const semitones = noteMap[pitch] + (Number(octave) - 4) * 12;

  return 440 * 2 ** (semitones / 12);
}

function removeAfter(element, delay) {
  window.setTimeout(() => element.remove(), delay);
}

function clearLayer(layer) {
  layer.replaceChildren();
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}
