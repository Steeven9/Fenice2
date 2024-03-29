import { Character } from "@/types/Initiative";

export function advanceCharacter(order: Character[], turn: number) {
  const newOrder = [...order];
  let newTurn = turn;
  const currentCharacter = newOrder.findIndex((character) => character.active);
  if (currentCharacter != -1) {
    newOrder[currentCharacter].active = false;
  }
  newOrder[(currentCharacter + 1) % newOrder.length].active = true;

  if (currentCharacter === newOrder.length - 1) {
    newTurn = turn + 1;
  }
  return { newOrder, newTurn };
}

export function getHealthDescription(character: Character) {
  if (character.currentHealth <= 0) {
    return { text: "Unconscious", color: "" };
  }

  const hpRatio = character.currentHealth / character.totalHealth;
  if (hpRatio >= 1) {
    return { text: "Untouched", color: "text-green-800" };
  } else if (hpRatio > 0.8) {
    return { text: "Barely injured", color: "text-green-500" };
  } else if (hpRatio > 0.6) {
    return { text: "Lightly injured", color: "text-yellow-600" };
  } else if (hpRatio > 0.4) {
    return { text: "Injured", color: "text-orange-500" };
  } else if (hpRatio > 0.2) {
    return { text: "Gravely injured", color: "text-red-600" };
  } else {
    return { text: "Near death", color: "text-red-800" };
  }
}

// name, init value, current hp, total hp[, enemy]
export function parseBlock(inputText: string, player: string) {
  const players: Character[] = [];
  for (let line of inputText.split("\n")) {
    // ignore comments
    if (line.startsWith("#") || line.startsWith("/")) {
      continue;
    }

    const values = line.split(",");
    if (values.length < 2 || Number.isNaN(Number.parseFloat(values[1]))) {
      console.error(`Invalid input: ${line}`);
      continue;
    }
    players.push({
      name: values[0],
      score: Number.parseFloat(values[1]),
      currentHealth: Number.parseInt(values[2]) || 0,
      totalHealth: Number.parseInt(values[3]) || 0,
      active: false,
      isPlayer: false,
      isEnemy: values.length > 4 && values[4].toLowerCase() === "true",
      player: player,
      notes: "",
    });
  }
  return players;
}
