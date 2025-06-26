const API_BASE = "http://xxx"; // ← À remplacer par ton domaine réel

let currentLeader = null;

async function fetchLeader() {
  try {
    const res = await fetch(`${API_BASE}/leader`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    currentLeader = data;
    document.getElementById("leaderText").textContent = `🎯 Joueur ${data.id} a buzzé !`;
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
    data.sort((a, b) => b.score - a.score).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = `Joueur ${p.id}`;
      const score = document.createElement("span");
      score.textContent = `${p.score} pts`;
      li.appendChild(score);
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Erreur fetch scores", err);
  }
}

async function handleReset() {
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
    const text = await res.text();
    setGameText(`🔄 ${text}`);
    await refreshData();
  } catch {
    setGameText("Erreur pendant 'New Game'");
  }
}

async function handleValidate() {
  if (!currentLeader) {
    setGameText("Aucun joueur à valider");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/validate/${currentLeader.id}`, { method: "POST" });
    const text = await res.text();
    setGameText(`✅ ${text}`);
    await refreshData();
  } catch {
    setGameText("Erreur pendant 'Gagné'");
  }
}

async function handleBuzz() {
  if (!currentLeader) {
    setGameText("Aucun joueur à refuser");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/buzz/${currentLeader.id}`, { method: "POST" });
    const text = await res.text();
    setGameText(`❌ ${text}`);
    await refreshData();
  } catch {
    setGameText("Erreur pendant 'Perdu'");
  }
}

function setGameText(text) {
  document.getElementById("gameText").textContent = text;
}

async function refreshData() {
  await Promise.all([fetchLeader(), fetchScores()]);
}

// Rafraîchissement initial + toutes les 2 secondes
refreshData();
setInterval(refreshData, 2000);
