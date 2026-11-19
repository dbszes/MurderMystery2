
const lecteur = document.getElementById("lecteur");

function jouer(nom) {
  lecteur.pause();
  lecteur.currentTime = 0;
  lecteur.src = "sons/" + nom + ".mp3";
  lecteur.play().catch(() => {
    alert("Vérifie que le son existe dans le dossier sons !");
  });
}

function arreter() {
  lecteur.pause();
  lecteur.currentTime = 0;
}

function rejoindre() {
  const pseudo = document.getElementById("pseudo").value.trim();

  if (!pseudo) {
    document.getElementById("message").textContent =
      "Entre ton pseudo !";
    return;
  }

  document.getElementById("message").textContent =
    "Bienvenue " + pseudo + " ! 🌙";
}
