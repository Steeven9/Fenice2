import { playTTS } from "@/actions/initiative";
import { Character } from "@/types/Initiative";

// we have to fully write out all the classes
// that we want Tailwind to bundle

export const healthColors = [
  "text-green-700",
  "text-green-600",
  "text-yellow-600",
  "text-orange-500",
  "text-red-500",
  "text-red-700",
];

const pgColors = [
  "bg-player",
  "bg-ally",
  "bg-enemy",
  "border-player",
  "border-ally",
  "border-enemy",
];

// array of lines to use randomly for the next turn TTS.
// CHARACTER gets replaced dynamically with the character name at invocation time
// note: swear words will be censored lol
const announcerLines = [
  "It's CHARACTER's turn",
  "CHARACTER - mess 'em up",
  "Go, CHARACTER!",
  "CHARACTER, you're up",
  "Next up: CHARACTER",
  "Now serving: CHARACTER",
  "CHARACTER, I choose you!",
];

// same as above but when you're low HP
const lowHealthLines = [
  "Thread carefully, CHARACTER",
  "Careful, CHARACTER",
  "CHARACTER, turn it around",
  "You can do it, CHARACTER",
];

export function advanceCharacter(
  order: Character[],
  turn: number,
  tts = false
) {
  const newOrder = [...order];
  let newTurn = turn;
  const currentCharacter = newOrder.findIndex((character) => character.active);
  if (currentCharacter != -1) {
    newOrder[currentCharacter].active = false;
  }
  const newChar = newOrder[(currentCharacter + 1) % newOrder.length];
  newChar.active = true;

  if (currentCharacter === newOrder.length - 1) {
    newTurn = turn + 1;
  }
  if (tts) {
    let line: string;
    if (newChar.currentHealth / newChar.totalHealth > 0.5) {
      line = announcerLines[getRandomValue(0, announcerLines.length - 1)];
    } else {
      line = lowHealthLines[getRandomValue(0, lowHealthLines.length - 1)];
    }
    playTTS(line.replaceAll("CHARACTER", newChar.name));
  }
  return { newOrder, newTurn };
}

export function getHealthDescription(character: Character) {
  if (character.currentHealth <= 0) {
    return { text: "Unconscious", color: healthColors[5] };
  }

  const hpRatio = character.currentHealth / character.totalHealth;
  if (hpRatio >= 1) {
    return { text: "Untouched", color: healthColors[0] };
  } else if (hpRatio > 0.8) {
    return { text: "Barely injured", color: healthColors[1] };
  } else if (hpRatio > 0.6) {
    return { text: "Lightly injured", color: healthColors[2] };
  } else if (hpRatio > 0.4) {
    return { text: "Injured", color: healthColors[3] };
  } else if (hpRatio > 0.2) {
    return { text: "Gravely injured", color: healthColors[4] };
  } else {
    return { text: "Near death", color: healthColors[5] };
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

/**
 * Generates a random number between the given values.
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random number between the given values
 */
export function getRandomValue(min: number, max: number) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomValue = array[0];
  return Math.floor((randomValue / 0xffffffff) * (max - min + 1) + min);
}

export function getCharacterType(character: Character) {
  if (character.isEnemy) return "enemy";

  if (!character.isPlayer && !character.isEnemy) return "ally";

  return "player";
}
