
const lecteur = document.getElementById("lecteur");

let contexteAudio;

function audio() {
  if (!contexteAudio) {
    contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (contexteAudio.state === "suspended") {
    contexteAudio.resume();
  }

  return contexteAudio;
}

function jouer(nom) {
  if (nom === "couteau") {
    jouerCouteau();
    return;
  }

  if (nom === "roulement") {
    jouerRoulement();
    return;
  }

  lecteur.pause();
  lecteur.currentTime = 0;
  lecteur.src = "sons/" + nom + ".mp3";

  lecteur.play().catch(() => {
    alert("Fichier introuvable : sons/" + nom + ".mp3");
  });
}

function arreter() {
  lecteur.pause();
  lecteur.currentTime = 0;
}

function jouerCouteau() {
  const ctx = audio();
  const t = ctx.currentTime;

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const bruit = ctx.createBufferSource();
  bruit.buffer = buffer;

  const filtre = ctx.createBiquadFilter();
  filtre.type = "highpass";
  filtre.frequency.value = 1000;

  const volume = ctx.createGain();
  volume.gain.setValueAtTime(0.7, t);
  volume.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

  bruit.connect(filtre);
  filtre.connect(volume);
  volume.connect(ctx.destination);
  bruit.start(t);
}

function jouerRoulement() {
  const ctx = audio();
  const debut = ctx.currentTime;

  for (let i = 0; i < 32; i++) {
    const progression = i / 32;
    const intervalle = 0.12 - progression * 0.085;
    const t = debut + i * intervalle;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = 90 + Math.random() * 35;

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  const t = debut + 2.85;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(100, t);
  osc.frequency.exponentialRampToValueAtTime(35, t + 0.5);

  gain.gain.setValueAtTime(0.7, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.6);
}

function rejoindre() {
  const pseudo = document.getElementById("pseudo").value.trim();
  const message = document.getElementById("message");

  if (!pseudo) {
    message.textContent = "Entre ton pseudo !";
    return;
  }

  message.textContent = "Bienvenue " + pseudo + " dans MYSTERY NIGHT !";
}
