// -----------------------------
// Mini jeu Pokémon CLI
// -----------------------------

// Importation des modules nécessaires
const axios = require("axios");       // Pour récupérer les données depuis la PokéAPI
const inquirer = require("inquirer"); // Pour créer des menus interactifs dans le terminal

// -----------------------------
// Constantes du jeu
// -----------------------------
const API = "https://pokeapi.co/api/v2"; // Base URL de l'API Pokémon
const START_HP = 300;                     // Points de vie initiaux pour chaque Pokémon
const MOVES_COUNT = 5;                    // Nombre d'attaques sélectionnées par Pokémon

// -----------------------------
// Fonction utilitaire
// -----------------------------
function randInt(max) {
  // Retourne un entier aléatoire entre 0 et max-1
  return Math.floor(Math.random() * max);
}

// -----------------------------
// Récupération des données Pokémon et attaques
// -----------------------------
async function getPokemon(name) {
  // Récupère les données d'un Pokémon via l'API
  const { data } = await axios.get(`${API}/pokemon/${name.toLowerCase()}`);
  return data;
}

async function getMove(url) {
  // Récupère les infos d'une attaque spécifique
  const { data } = await axios.get(url);
  return {
    name: data.name,
    power: data.power,
    accuracy: data.accuracy
  };
}

function nice(s) {
  // Formate le nom d'une attaque pour remplacer les "-" par des espaces
  return s.replace(/-/g, " ");
}

// -----------------------------
// Sélection aléatoire de 5 attaques valides
// -----------------------------
async function pickFiveMoves(pokemonData) {
  // Mélange les attaques disponibles
  const pool = [...pokemonData.moves].sort(() => Math.random() - 0.5);
  const chosen = [];

  for (const m of pool) {
    if (chosen.length >= MOVES_COUNT) break; // Stop si 5 attaques choisies
    try {
      const mv = await getMove(m.move.url);
      // On ajoute seulement si power et accuracy sont des nombres
      if (typeof mv.power === "number" && typeof mv.accuracy === "number") {
        chosen.push(mv);
      }
    } catch (_) {
      // On ignore les erreurs si certaines attaques ne sont pas valides
    }
  }

  if (chosen.length < MOVES_COUNT) {
    throw new Error("Pas assez d'attaques valides trouvées pour ce Pokémon.");
  }

  return chosen.slice(0, MOVES_COUNT);
}

// -----------------------------
// Fonction pour déterminer si une attaque rate
// -----------------------------
function miss(accuracy) {
  const r = Math.floor(Math.random() * 101); // nombre aléatoire 0..100
  return accuracy < r; // retourne true si l'attaque rate
}

// -----------------------------
// Fonction principale du jeu
// -----------------------------
async function main() {
  console.log("=== Jeu Pokémon (CLI) ===\n");

  // --- Choix du Pokémon par le joueur ---
  const { pname } = await inquirer.prompt([{
    type: "input",
    name: "pname",
    message: "Entre le nom de TON Pokémon (: pikachu, charizard, gengar) :"
  }]);
  const player = await getPokemon(pname.trim());

  // --- Choix du Pokémon du bot aléatoire ---
  const botNames = ["blastoise", "venusaur", "arcanine", "alakazam", "dragonite", "machamp", "snorlax", "garchomp"];
  const bot = await getPokemon(botNames[randInt(botNames.length)]);

  // --- Sélection des 5 attaques de chaque Pokémon ---
  const playerMoves = await pickFiveMoves(player);
  const botMoves = await pickFiveMoves(bot);

  // --- Initialisation des HP ---
  let php = START_HP; // HP du joueur
  let bhp = START_HP; // HP du bot

  console.log(`\nTu: ${player.name.toUpperCase()}  HP: ${php}`);
  console.log(`Bot: ${bot.name.toUpperCase()}     HP: ${bhp}\n`);

  // --- Boucle de combat ---
  while (php > 0 && bhp > 0) {

    // --- Tour du joueur ---
    const { mv } = await inquirer.prompt([{
      type: "list",
      name: "mv",
      message: "Choisis ton attaque :",
      choices: playerMoves.map(m => ({
        name: `${nice(m.name)}  (Pow:${m.power}  Acc:${m.accuracy}%)`,
        value: m
      }))
    }]);

    if (miss(mv.accuracy)) {
      console.log(`Ton ${nice(mv.name)} rate.`);
    } else {
      bhp = Math.max(0, bhp - mv.power); // On ne descend pas en dessous de 0
      console.log(`Tu infliges ${mv.power} dégâts. Bot HP: ${bhp}/${START_HP}`);
    }

    if (bhp <= 0) break; // Si le bot est KO, fin du combat

    // --- Tour du bot ---
    const bmv = botMoves[randInt(botMoves.length)];
    if (miss(bmv.accuracy)) {
      console.log(`Le ${nice(bmv.name)} du bot rate.`);
    } else {
      php = Math.max(0, php - bmv.power);
      console.log(`Le bot inflige ${bmv.power} dégâts. Ton HP: ${php}/${START_HP}`);
    }

    console.log(""); // Ligne vide pour séparer les tours
  }

  // --- Résultat du combat en mots simples ---
  if (php <= 0 && bhp <= 0) {
    console.log("Égalité !");
  } else if (bhp <= 0) {
    console.log("Tu as gagné !");
  } else {
    console.log("Tu as perdu !");
  }
}

// -----------------------------
// Lancement du jeu avec gestion des erreurs
// -----------------------------
main().catch(err => {
  console.error("Erreur:", err.message || err);
  process.exit(1);
});
