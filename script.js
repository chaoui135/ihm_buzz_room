const API_BASE = "http://xxx"; // ← Remplace par ton vrai domaine local ou distant
const DEFAULT_ID = 0;

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
    console.error("Erreur lors de la récupération des scores", err);
  }
}

async function handleReset() {
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
    await res.text();
    await fetchScores();
  } catch {
    alert("Erreur pendant 'Nouveau Jeu'");
  }
}

async function handleValidate() {
  try {
    const res = await fetch(`${API_BASE}/validate/${DEFAULT_ID}`, { method: "POST" });
    await res.text();
    await fetchScores();
  } catch {
    alert("Erreur pendant 'Gagné'");
  }
}

async function handleBuzz() {
  try {
    const res = await fetch(`${API_BASE}/buzz/${DEFAULT_ID}`, { method: "POST" });
    await res.text();
    await fetchScores();
  } catch {
    alert("Erreur pendant 'Perdu'");
  }
}

fetchScores();
setInterval(fetchScores, 2000);
