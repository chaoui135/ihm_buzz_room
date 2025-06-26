const API_BASE = "http://xxx"; // ← Remplace par ton vrai domaine local ou distant
const DEFAULT_ID = 0;

async function fetchScores() {
  console.log("[INFO] Récupération des scores...");
  try {
    const res = await fetch(`${API_BASE}/scores`);
    const data = await res.json();
    console.log("[SUCCESS] Scores reçus :", data);

    const list = document.getElementById("scoreList");
    list.innerHTML = "";
    data.sort((a, b) => b.score - a.score).forEach(player => {
      const li = document.createElement("li");
      li.innerHTML = `Joueur ${player.id} <span>${player.score} pts</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("[ERROR] Échec lors de la récupération des scores :", err);
  }
}

async function handleReset() {
  console.log("[ACTION] Nouveau jeu demandé...");
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
    const text = await res.text();
    console.log("[SUCCESS] Réponse du reset :", text);
    await fetchScores();
  } catch (err) {
    console.error("[ERROR] Échec pendant 'Nouveau Jeu'", err);
    alert("Erreur pendant 'Nouveau Jeu'");
  }
}

async function handleValidate() {
  console.log(`[ACTION] Validation du joueur ID=${DEFAULT_ID}...`);
  try {
    const res = await fetch(`${API_BASE}/validate/${DEFAULT_ID}`, { method: "POST" });
    const text = await res.text();
    console.log("[SUCCESS] Réponse de validation :", text);
    await fetchScores();
  } catch (err) {
    console.error("[ERROR] Échec pendant 'Gagné'", err);
    alert("Erreur pendant 'Gagné'");
  }
}

async function handleBuzz() {
  console.log(`[ACTION] Refus (buzz) du joueur ID=${DEFAULT_ID}...`);
  try {
    const res = await fetch(`${API_BASE}/buzz/${DEFAULT_ID}`, { method: "POST" });
    const text = await res.text();
    console.log("[SUCCESS] Réponse de buzz :", text);
    await fetchScores();
  } catch (err) {
    console.error("[ERROR] Échec pendant 'Perdu'", err);
    alert("Erreur pendant 'Perdu'");
  }
}

console.log("[INIT] Lancement initial du fetch des scores...");
fetchScores();
setInterval(() => {
  console.log("[TIMER] Mise à jour automatique des scores...");
  fetchScores();
}, 2000);
