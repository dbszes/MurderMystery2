
const lecteur = document.getElementById("lecteur");

// Lire les musiques et les effets
function jouer(nom) {
  if (nom === "roulement") {
    jouerRoulement();
    return;
  }

  if (nom === "couteau") {
    jouerCouteau();
    return;
  }

  lecteur.pause();
  lecteur.currentTime = 0;
  lecteur.src = "sons/" + nom + ".mp3";

  lecteur.play().catch(() => {
    alert("Impossible de lire ce son. Vérifie le dossier sons !");
  });
}

// Arrêter les musiques
function arreter() {
  lecteur.pause();
  lecteur.currentTime = 0;
}

// Créer un roulement de tambour de 3 secondes
function jouerRoulement() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const debut = ctx.currentTime;

  for (let i = 0; i < 32; i++) {
    const temps = i / 32;
    const intervalle = 0.12 - temps * 0.085;
    const t = debut + i * intervalle;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(90 + Math.random() * 35, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Gros coup final
  const t = debut + 2.85;
  const final = ctx.createOscillator();
  const volume = ctx.createGain();

  final.type = "sine";
  final.frequency.setValueAtTime(100, t);
  final.frequency.exponentialRampToValueAtTime(35, t + 0.5);

  volume.gain.setValueAtTime(0.7, t);
  volume.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

  final.connect(volume);
  volume.connect(ctx.destination);

  final.start(t);
  final.stop(t + 0.6);
}

// Créer un effet de couteau
function jouerCouteau() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const t = ctx.currentTime;

  const buffer = ctx.createBuffer(
    1,
    ctx.sampleRate * 0.35,
    ctx.sampleRate
  );

  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const bruit = ctx.createBufferSource();
  bruit.buffer = buffer;

  const filtre = ctx.createBiquadFilter();
  filtre.type = "highpass";
  filtre.frequency.value = 1200;

  const volume = ctx.createGain();
  volume.gain.setValueAtTime(0.7, t);
  volume.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

  bruit.connect(filtre);
  filtre.connect(volume);
  volume.connect(ctx.destination);

  bruit.start(t);
}

// Rejoindre le lobby
function rejoindre() {
  const pseudo = document.getElementById("pseudo").value.trim();
  const message = document.getElementById("message");

  if (!pseudo) {
    message.textContent = "Entre ton pseudo !";
    return;
  }

  message.textContent = "Bienvenue " + pseudo + " dans MYSTERY NIGHT ! 🌙";
}
