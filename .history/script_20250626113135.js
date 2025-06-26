const API_BASE = "http://xxx"; // Remplace par ton vrai domaine
let currentLeader = null;

async function fetchLeader() {
  try {
    const res = await fetch(`${API_BASE}/leader`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    currentLeader = data;
    document.getElementById("leaderText").textContent = `🎯 Joueur ${data.id} a pris la main`;
  } catch {
    currentLeader = null;
    document.getElementById("leaderText").textContent = "Aucun joueur n’a buzzé";
  }
}

async function fetchScores() {
  try {
    const res = await fetch(`${API_BASE}/scores`);
    const data = await res.json();
    const list = document.getElementById("scoreList");
    list.innerHTML = "";
    data.sort((a, b) => b.score - a.score).forEach(player => {
      const li = document.createElement("li");
      li.innerHTML = `Joueur ${player.id} <span>${player.score} pts</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Erreur scores", err);
  }
}

async function handleReset() {
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
    await res.text();
    await refresh();
  } catch {
    alert("Erreur pendant 'Nouveau Jeu'");
  }
}

async function handleValidate() {
  if (!currentLeader) return alert("Aucun joueur à valider");
  try {
    const res = await fetch(`${API_BASE}/validate/${currentLeader.id}`, { method: "POST" });
    await res.text();
    await refresh();
  } catch {
    alert("Erreur pendant 'Gagné'");
  }
}

async function handleBuzz() {
  if (!currentLeader) return alert("Aucun joueur à refuser");
  try {
    const res = await fetch(`${API_BASE}/buzz/${currentLeader.id}`, { method: "POST" });
    await res.text();
    await refresh();
  } catch {
    alert("Erreur pendant 'Perdu'");
  }
}

async function refresh() {
  await Promise.all([fetchLeader(), fetchScores()]);
}

refresh();
setInterval(refresh, 2000); // Mise à jour toutes les 2 sec
