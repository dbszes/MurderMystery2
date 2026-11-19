
const lecteur = document.getElementById("lecteur");

function jouer(nom) {
  if (nom === "roulement") {
    jouerRoulement();
    return;
  }

  lecteur.pause();
  lecteur.currentTime = 0;
  lecteur.src = "sons/" + nom + ".mp3";
  lecteur.play().catch(() => {
    alert("Vérifie que le son existe dans le dossier sons !");
  });
}

function jouerRoulement() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const debut = ctx.currentTime;

  // Roulement qui accélère pendant 3 secondes
  for (let i = 0; i < 32; i++) {
    const temps = i / 32;
    const intervalle = 0.12 - temps * 0.085;
    const t = debut + i * intervalle;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(90 + Math.random() * 35, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

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

function arreter() {
  lecteur.pause();
  lecteur.currentTime = 0;
}

function rejoindre() {
  const pseudo = document.getElementById("pseudo").value.trim();

  if (!pseudo) {
    document.getElementById("message").textContent = "Entre ton pseudo !";
    return;
  }

  document.getElementById("message").textContent =
    "Bienvenue " + pseudo + " ! 🌙";
}
