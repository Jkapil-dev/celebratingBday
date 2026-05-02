document.addEventListener("DOMContentLoaded", () => {
  const nameScreen = document.getElementById("nameScreen");
  const nameForm = document.getElementById("nameForm");
  const nameInput = document.getElementById("nameInput");
  const nameError = document.getElementById("nameError");
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
  const endingFlow = document.getElementById("endingFlow");
  const endingQuote = document.getElementById("endingQuote");
  const endingQuestion = document.getElementById("endingQuestion");
  const yesButton = document.getElementById("yesButton");
  const endingResponse = document.getElementById("endingResponse");
  const fadeOverlay = document.getElementById("fadeOverlay");
  const heartsLayer = document.getElementById("heartsLayer");
  const particlesLayer = document.getElementById("particlesLayer");
  const confettiLayer = document.getElementById("confettiLayer");
  const balloonLayer = document.getElementById("balloonLayer");
  const sparkleLayer = document.getElementById("sparkleLayer");
  const countdownEl = document.getElementById("countdownTimer");

  const confettiColors = ["#ffb6d2", "#ffd6c2", "#e6d5ff", "#fff0a8", "#ffffff"];
  const balloonColors = ["#ffc0d8", "#ffd7c7", "#dfccff", "#fff0f5", "#ffabc9"];
  let audioContext;
  let masterGain;
  let musicTimer;
  let typingTimer;
  let endingTimer;
  let resetTimer;
  let displayName = "birthday star";
  let isMuted = false;
  let celebrationRunning = false;

  createAmbientHearts();
  createParticles();
  initializeNameFlow();
  window.setInterval(updateCountdown, 1000);
  updateCountdown();

  nameForm.addEventListener("submit", handleNameSubmit);
  nameInput.addEventListener("input", () => {
    nameError.textContent = "";
  });
  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleNameSubmit(event);
    }
  });
  startButton.addEventListener("click", () => startCelebration(true));
  replayButton.addEventListener("click", () => startCelebration(true));
  yesButton.addEventListener("click", handleHappyResponse);
  soundToggle.addEventListener("click", toggleSound);

  function initializeNameFlow() {
    const params = new URLSearchParams(window.location.search);
    const urlName = cleanName(params.get("name"));
    const sessionName = cleanName(sessionStorage.getItem("birthdayName"));
  
    const name = urlName || sessionName;
  
    if (name) {
      sessionStorage.setItem("birthdayName", name);
      setDisplayName(name);
      showScreen(landingScreen);
      return;
    }
  
    showScreen(nameScreen);
    setTimeout(() => nameInput.focus(), 300);
  }


  function handleNameSubmit(event) {
    event.preventDefault();
    const name = cleanName(nameInput.value);
  
    if (!name) {
      nameError.textContent = "Please enter a name to continue.";
      nameInput.focus();
      return;
    }
  
    nameError.textContent = "";
    sessionStorage.setItem("birthdayName", name);
    setDisplayName(name);
    showScreen(landingScreen);
  }

  function setDisplayName(name) {
    displayName = name || "birthday star";
    friendName.textContent = displayName;
    birthdayTitle.textContent = `Happy Birthday, ${displayName}`;
  }

  function getBirthdayMessage() {
    return `Wishing you endless happiness, laughter, and success, ${displayName}. May this year feel gentle, bright, and full of little moments that make your heart smile.`;
  }

  function showScreen(screen) {
    [nameScreen, landingScreen, celebrationScreen].forEach((item) => {
      item.classList.toggle("is-visible", item === screen);
    });
  }

  function cleanName(value) {
    if (!value) {
      return "";
    }

    return value
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 28);
  }

  function startCelebration(allowSound) {
    if (celebrationRunning) {
      resetCelebration();
    }

    celebrationRunning = true;
    resetEndingFlow();
    showScreen(celebrationScreen);
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
      typeMessage(getBirthdayMessage());
    }, 3400);

    if (allowSound && !isMuted) {
      startMusic();
    }
  }

  function resetCelebration() {
    window.clearTimeout(typingTimer);
    window.clearTimeout(endingTimer);
    window.clearTimeout(resetTimer);
    clearLayer(confettiLayer);
    clearLayer(balloonLayer);
    clearLayer(sparkleLayer);
    cakeStage.classList.remove("is-active");
    messageCard.classList.remove("is-active");
    typedMessage.textContent = "";
    typedMessage.classList.remove("is-done");
    resetEndingFlow();
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
    window.clearTimeout(typingTimer);
    let index = 0;
    const speed = window.innerWidth < 640 ? 34 : 28;

    function typeNext() {
      typedMessage.textContent = message.slice(0, index);
      index += 1;

      if (index <= message.length) {
        typingTimer = window.setTimeout(typeNext, speed);
      } else {
        typedMessage.classList.add("is-done");
        celebrationRunning = false;
        showEndingPrompt();
      }
    }

    typeNext();
  }

  function showEndingPrompt() {
    endingTimer = window.setTimeout(() => {
      endingQuote.classList.add("is-visible");
    }, 450);

    resetTimer = window.setTimeout(() => {
      endingQuestion.classList.add("is-visible");
      yesButton.focus();
    }, 1250);
  }

  function handleHappyResponse() {
    endingQuestion.classList.add("is-fading");

    endingTimer = window.setTimeout(() => {
      endingQuestion.classList.remove("is-visible");
      endingQuestion.classList.add("is-hidden");
      endingResponse.classList.add("is-visible");
    }, 650);

    resetTimer = window.setTimeout(() => {
      fadeOverlay.classList.add("is-visible");
      window.requestAnimationFrame(() => {
        fadeOverlay.classList.add("is-fading");
      });
    }, 2050);

    window.setTimeout(resetToNewSession, 4250);
  }

  function resetToNewSession() {
    sessionStorage.removeItem("birthdayName");
    localStorage.removeItem("birthdayName");
    window.clearTimeout(musicTimer);
    window.clearTimeout(typingTimer);
    window.clearTimeout(endingTimer);
    window.clearTimeout(resetTimer);

    displayName = "birthday star";
    friendName.textContent = "Lovely";
    birthdayTitle.textContent = "To a beautiful soul";
    nameInput.value = "";
    nameError.textContent = "";
    typedMessage.textContent = "";
    typedMessage.classList.remove("is-done");
    celebrationRunning = false;
    resetEndingFlow();
    clearLayer(confettiLayer);
    clearLayer(balloonLayer);
    clearLayer(sparkleLayer);
    cakeStage.classList.remove("is-active");
    messageCard.classList.remove("is-active");
    showScreen(nameScreen);
    nameScreen.classList.add("is-restarting");

    window.setTimeout(() => {
      fadeOverlay.classList.remove("is-fading");
    }, 180);

    window.setTimeout(() => {
      fadeOverlay.classList.remove("is-visible");
      nameInput.focus();
    }, 2300);

    window.setTimeout(() => {
      nameScreen.classList.remove("is-restarting");
    }, 1800);
  }

  function resetEndingFlow() {
    endingQuote.classList.remove("is-visible");
    endingQuestion.classList.remove("is-visible", "is-fading", "is-hidden");
    endingResponse.classList.remove("is-visible");
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

  function getNextMidnight() {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight;
  }

  function updateCountdown() {
    if (!countdownEl) {
      return;
    }

    const now = new Date();
    const target = getNextMidnight();
    const diff = target - now;

    if (diff <= 0) {
      countdownEl.textContent = "00:00:00";

      if (!celebrationRunning) {
        window.setTimeout(() => startCelebration(true), 800);
      }
      return;
    }

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    countdownEl.textContent = `${hours}:${minutes}:${seconds}`;
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
});
