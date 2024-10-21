"use client";

import { loadInitiative, saveInitiative } from "@/actions/initiative";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Dropdown from "@/components/dropdown";
import Textfield from "@/components/textfield";
import {
  advanceCharacter,
  getCharacterType,
  getHealthDescription,
  getRandomValue,
  healthColors,
  parseBlock,
} from "@/lib/initiative";
import { showAlert } from "@/lib/utils";
import { Character, GameData } from "@/types/Initiative";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronsRight,
  Crosshair,
  FastForward,
  Heart,
  Loader,
  Play,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "react-feather";
import io from "socket.io-client";

let socket: any;

export default function InitiativePage() {
  const { data: session } = useSession();
  const isAdmin = session?.user.roles.includes("admin");
  const isPlayer = session?.user.roles.includes("player");
  const isDM = session?.user.roles.includes("dm") ?? false;

  const [order, setOrder] = useState<Character[]>([]);
  const [turn, setTurn] = useState(1);

  const [isEditing, setIsEditing] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [shouldTTS, setShouldTTS] = useState(false);
  const [isEnemy, setIsEnemy] = useState(isDM);
  const [shouldPersist, setShouldPersist] = useState(isDM);

  const comparator = (characterA: Character, characterB: Character) =>
    characterB.score - characterA.score;

  const getFields = () => {
    let name = document.querySelector("#newCharacterName") as HTMLInputElement;
    let score = document.querySelector(
      "#newCharacterScore"
    ) as HTMLInputElement;
    let currentHealth = document.querySelector(
      "#newCharacterCurrentHealth"
    ) as HTMLInputElement;
    let totalHealth = document.querySelector(
      "#newCharacterTotalHealth"
    ) as HTMLInputElement;
    let notes = document.querySelector(
      "#newCharacterNotes"
    ) as HTMLInputElement;
    let amount = document.querySelector(
      "#newCharacterAmount"
    ) as HTMLInputElement;

    return { name, score, currentHealth, totalHealth, notes, amount };
  };

  const addCharacter = async () => {
    const { name, score, currentHealth, totalHealth, notes } = getFields();

    // we roll the dice for the DM
    let parsedScore =
      isDM && !isEditing
        ? getRandomValue(1, 20) + parseFloat(score.value)
        : parseFloat(score.value);

    // WIP
    // let parsedAmount = amount?.value || 1;

    const oldValue = order.find((character) => character.name === name.value);
    if (!isEditing && oldValue) {
      showAlert({
        title: "Invalid input",
        text: `Character ${name.value} already exists`,
        icon: "error",
        showCancelButton: false,
      });
      console.error("Character already exists", name.value, score.value);
      return;
    }

    if (!name.value || !score.value) {
      showAlert({
        title: "Invalid input",
        text: "Name or initiative value are missing or invalid",
        icon: "error",
        showCancelButton: false,
      });
      console.error("Invalid input", name.value, score.value);
      return;
    }

    if (
      !isEditing &&
      order.find((character) => character.score == parsedScore)
    ) {
      const oldIndex = order.findIndex(
        (character) => character.score == parsedScore
      );

      // we decide randomly who goes first
      const result = getRandomValue(0, 1);

      let modifier: number;
      if (result == 1) {
        // the new one goes first -> put them higher
        modifier = 0.01;
      } else {
        // the already present one goes first -> put the new one lower
        modifier = -0.01;
      }

      // increase or decrease modifier until they have a unique value
      while (
        order.findIndex(
          (character) => character.score == parsedScore + modifier
        ) !== -1
      ) {
        modifier += modifier;
      }

      parsedScore = order[oldIndex].score + modifier;
    }

    const newCharacter: Character = {
      name: name.value,
      score: parsedScore,
      active: oldValue?.active ?? false,
      player: oldValue?.player ?? session?.user.email ?? "",
      isPlayer: oldValue?.isPlayer ?? !isDM,
      isEnemy: isEnemy,
      currentHealth: parseInt(currentHealth.value) || 0,
      totalHealth: parseInt(totalHealth.value) || 0,
      notes: notes.value,
    };

    const oldIndex = order.findIndex(
      (character) => character.name == name.value
    );
    if (oldIndex == -1) {
      order.push(newCharacter);
    } else {
      order[oldIndex] = newCharacter;
    }
    const newOrder = [...order].toSorted(comparator);

    if (shouldPersist) {
      if (/\d/.test(name.value)) {
        const digit = RegExp(/\d+/).exec(name.value);
        if (digit != null && !name.value.includes("-")) {
          name.value = name.value.replace(
            digit[0],
            (Number.parseInt(digit[0]) + 1).toString()
          );
        }
      } else {
        name.value += " 1";
      }
    } else {
      name.value = "";
      currentHealth.value = "";
      totalHealth.value = "";
      notes.value = "";
      score.value = "";
    }

    save({ order: newOrder, turn: turn, shouldTTS });
    setIsEditing(false);
  };

  const removeCharacter = (name: string) => {
    showAlert({
      title: "Remove character?",
      text: `Do you want to remove ${name} from the initiative?`,
      icon: "warning",
      confirmButtonText: "Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCharacter(name);
      }
    });
  };

  const editCharacter = (currentCharacter: string) => {
    setIsEditing(true);
    const { name, score, currentHealth, totalHealth, notes } = getFields();

    const character =
      order[order.findIndex((character) => character.name == currentCharacter)];
    name.value = character.name;
    score.value = character.score.toString();
    currentHealth.value = character.currentHealth.toString();
    totalHealth.value = character.totalHealth.toString();
    setIsEnemy(character.isEnemy);

    notes.value = character.notes;

    document
      .querySelector("#newCharacterName")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const deleteCharacter = (currentCharacter: string) => {
    const isActive =
      order.find((character) => character.active)?.name === currentCharacter;
    let newOrder = order;
    let newTurn = turn;

    if (isActive) {
      const res = advanceCharacter(order, turn);
      newOrder = res.newOrder;
      newTurn = res.newTurn;
    }

    save({
      order: newOrder.filter(
        (character) => character.name !== currentCharacter
      ),
      turn: newTurn,
      shouldTTS,
    });
  };

  const damageCharacter = async (currentCharacter: string) => {
    const { value: damage } = await showAlert({
      title: "Enter damage",
      inputLabel: "How much damage? Tip: enter a negative value for healing",
      input: "text",
      inputValidator: (value) => {
        if (!value) {
          return "Please provide a healing value";
        }
      },
    });
    if (damage) {
      const newOrder = [...order];
      const pos = newOrder.findIndex(
        (character) => character.name === currentCharacter
      );
      let parsedDamage = Number.parseInt(damage);
      if (damage.toLowerCase() === "full") {
        newOrder[pos].currentHealth = newOrder[pos].totalHealth;
        save({ order: newOrder, turn: turn, shouldTTS });
      } else if (Number.isInteger(parsedDamage)) {
        newOrder[pos].currentHealth -= parsedDamage;
        if (newOrder[pos].currentHealth < 0) {
          newOrder[pos].currentHealth = 0;
        }
        save({ order: newOrder, turn: turn, shouldTTS });
      }
    }
  };

  const clear = () => {
    showAlert({
      title: "Clear initiative?",
      text: `Do you want to clear the entire initiative? This will remove every character from the party!`,
      icon: "warning",
      confirmButtonText: "Clear",
    }).then((result) => {
      if (result.isConfirmed) {
        save({ order: [], turn: 1, shouldTTS });
      }
    });
  };

  const restart = () => {
    showAlert({
      title: "Restart combat?",
      text: `Do you want to restart the combat? This will bring you back to the preparation phase.`,
      icon: "warning",
      confirmButtonText: "Restart",
    }).then((result) => {
      if (result.isConfirmed) {
        const newOrder = [...order];
        newOrder[newOrder.findIndex((character) => character.active)].active =
          false;
        save({ order: newOrder, turn: 1, shouldTTS });
      }
    });
  };

  const next = () => {
    const { newOrder, newTurn } = advanceCharacter(order, turn, shouldTTS);
    save({ order: newOrder, turn: newTurn, shouldTTS });
  };

  const save = (newData: GameData, sendUpdate = true) => {
    setOrder(newData.order);
    setTurn(newData.turn);
    setShouldTTS(newData.shouldTTS);
    if (sendUpdate) {
      socket.emit("characters-change", newData);
    }
    if (shouldScroll) {
      if (newData.order[0]?.active) {
        document.body.scrollIntoView({ behavior: "smooth" });
      } else {
        document
          .querySelector("div .font-semibold")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getHealthValue = (character: Character) => {
    const health = getHealthDescription(character);
    // show numerical HPs only to the DM or if it's a player character
    if (isDM || character.isPlayer) {
      return {
        text: `${character.currentHealth} / ${character.totalHealth}`,
        color: health.color,
      };
    } else {
      return health;
    }
  };

  const countCharacters = () => {
    let enemies = 0;
    let allies = 0;
    for (let character of order) {
      let chars = 0;
      // possible inputs:
      // "Orc" (=1), "Orc 2" (=1), "Orc 4-5" (=2),
      // "Orc 10&11" (=2), "Orc 2-3 & Orc 13-15" (=5)
      if (character.name.includes("-")) {
        if (/\D/g.test(character.name)) {
          // we only have letters, e.g. "Orc - running"
          chars = 1;
        } else {
          for (let chunk of character.name.split("&")) {
            const numbers = chunk.split("-");
            // we do the difference + 1 since: 4-6 => diff is two, but there are 3 elements
            chars +=
              parseInt(numbers[1].replace(/\D/g, "")) -
              parseInt(numbers[0].replace(/\D/g, "")) +
              1;
          }
        }
      } else {
        // we only have contiguous enemies, so number of elements is number of enemies
        // e.g. "Orc 1&2" (=2), "Orc 4&7&9" (=3)
        chars += character.name.split("&").length;
      }
      if (character.isEnemy) {
        enemies += chars;
      } else {
        allies += chars;
      }
    }
    return { enemies, allies };
  };

  const loadOrder = async () => {
    showAlert({
      title: "Load default?",
      text: `Do you want to load the default party? This will overwrite the current order!`,
      icon: "warning",
      confirmButtonText: "Load",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newOrder = await loadInitiative();
        if (newOrder.success) {
          save({ order: newOrder.data[0].order, turn: 1, shouldTTS });
        } else {
          console.error(newOrder.message);
          showAlert({
            title: "Error",
            text: "Couldn't load default party",
            icon: "error",
          });
        }
      }
    });
  };

  const saveOrder = async () => {
    showAlert({
      title: "Save default?",
      text: "Do you want save this party as default?",
      icon: "warning",
      confirmButtonText: "Save",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await saveInitiative(order);
      }
    });
  };

  const renderOrder = () => {
    if (order.length === 0) {
      return <p className="p-2">The party seems a little empty...</p>;
    }
    return order.map((character) => {
      // we don't want to show enemies to players before the fight starts
      if (character.isEnemy && !isCombatOngoing && !isDM) return;

      const health = getHealthValue(character);
      return (
        <div
          key={character.name}
          className={`my-2 p-2 pl-0.5 flex justify-between items-center ${
            character.active
              ? `border-${getCharacterType(character)} font-semibold`
              : "border-slate-600"
          } transition-all duration-500 border-solid border-2`}
        >
          <div className="flex">
            <div className={`bg-${getCharacterType(character)} mr-2`}>
              &nbsp;
            </div>
            <div>
              <p className="text-lg">
                {character.name}{" "}
                {character.notes && (isDM || character.isPlayer)
                  ? `(${character.notes})`
                  : ""}
              </p>
              <p className="text-sm italic flex space-x-2">
                <ChevronsRight /> {character.score}
                <Heart />
                <span className={health.color}>{health.text}</span>
              </p>
            </div>
          </div>

          <div className="flex">
            {isPlayer ? (
              <Button
                onClick={() => damageCharacter(character.name)}
                tooltip="Damage character"
                icon={<Crosshair />}
                className="!mb-0"
              />
            ) : null}
            <Dropdown
              links={[
                {
                  title: "Edit",
                  onClick: () => editCharacter(character.name),
                },
                {
                  title: "Remove",
                  onClick: () => removeCharacter(character.name),
                },
              ]}
              className="absolute right-0 mt-16 mr-3"
              disabled={!isPlayer || !(isDM || character.isPlayer)}
            />
          </div>
        </div>
      );
    });
  };

  const initializeSocket = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.info("Connected to socket");
    });

    socket.on("update-characters", (data: GameData) => {
      console.info("Received update");
      save(data, false);
    });

    socket.on("reload", () => {
      location.reload();
    });
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      requestWakeLock();
    }
  };

  const handleKeypress = (e: any) => {
    if (e.key == "Enter") {
      // brokn
      // addCharacter();
    }
  };

  // prevent screen from sleeping, https://developer.chrome.com/articles/wake-lock
  const requestWakeLock = async () => {
    if (!navigator.wakeLock) {
      console.warn("Wake Lock API not supported");
      return;
    }

    try {
      const wakeLock = await navigator.wakeLock.request();
      console.info("Screen Wake Lock acquired", wakeLock);
    } catch (err) {
      console.error("Cannot acquire Wake Lock", err);
    }
  };

  const forceReload = () => {
    socket.emit("force-refresh");
    location.reload();
  };

  const bulkAdd = async () => {
    const { value: text } = await showAlert({
      input: "textarea",
      inputLabel:
        "Bulk add characters\nFormat: name, initiative, current hp, total hp[, enemy]\nNames MUST be unique!",
      inputPlaceholder: "Zombie,20,190,210,true\nLaura,25,150,150",
    });
    if (!text) {
      return;
    }

    const parsedText = parseBlock(text, session?.user.email!);

    // validate that there are no duplicate names
    for (let character of parsedText) {
      if (order.find((char) => char.name === character.name)) {
        showAlert({
          title: "Duplicated entry",
          text: `Character ${character.name} already exists`,
          icon: "error",
        });
        console.error(`Duplicated entry: ${character.name}`);
        return;
      }
    }
    const newOrder = [...order, ...parsedText].toSorted(comparator);
    save({ order: newOrder, turn: turn, shouldTTS });
  };

  useEffect(() => {
    initializeSocket();
    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document
      .querySelector("#newCharacterName")
      ?.addEventListener("keyup", handleKeypress);
    document
      .querySelector("#newCharacterScore")
      ?.addEventListener("keyup", handleKeypress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { enemies, allies } = countCharacters();
  const isCombatOngoing =
    order.findIndex((character) => character.active) !== -1;

  return (
    <>
      <p className="title">Initiative tracker</p>
      <p className="text-lg">
        {isCombatOngoing ? `Turn ${turn}` : "Preparing..."}
      </p>

      <div className="mt-4" id="order">
        {renderOrder()}
      </div>

      <div className="sticky bottom-0 py-2 items-center bg-main-bg dark:bg-main-bg-dark flex justify-between">
        <div>
          {enemies} enemies vs {allies} allies
          {isEditing ? " (editing...)" : ""}
        </div>
        {isPlayer ? (
          <Button
            label={isCombatOngoing ? "Next" : "Start"}
            icon={isCombatOngoing ? <FastForward /> : <Play />}
            disabled={order.length === 0 || (!isDM && !isCombatOngoing)}
            onClick={next}
          />
        ) : null}
      </div>

      {isPlayer ? (
        <>
          <p className="subtitle mt-4">
            {isEditing ? "Edit" : "Add"} character
          </p>
          <div className="my-4">
            <Textfield
              id="newCharacterName"
              placeholder="Character name"
              required
            />
            <Textfield
              id="newCharacterScore"
              placeholder={
                isDM && !isEditing ? "Initiative modifier" : "Initiative score"
              }
              type="number"
              required
            />
            <Textfield
              id="newCharacterCurrentHealth"
              placeholder="Current health"
              type="number"
            />
            <Textfield
              id="newCharacterTotalHealth"
              placeholder="Total health"
              type="number"
            />
            <Textfield
              id="newCharacterNotes"
              placeholder={`Notes${isDM ? " (hidden)" : ""}`}
              type="text"
            />
            {isDM ? (
              <Textfield
                id="newCharacterAmount"
                placeholder="Amount"
                type="number"
              />
            ) : null}
            <div className="text-center">
              {isDM ? (
                <>
                  <Checkbox
                    label="Enemy"
                    checked={isEnemy}
                    onChange={(e) => setIsEnemy(e.target.checked)}
                  />
                  <Checkbox
                    label="Persist"
                    checked={shouldPersist}
                    onChange={(e) => setShouldPersist(e.target.checked)}
                  />
                </>
              ) : null}
              <Button
                label={isEditing ? "Update" : "Add"}
                icon={isEditing ? <Check /> : <Plus />}
                onClick={addCharacter}
              />
            </div>
          </div>

          {isDM || isAdmin ? (
            <>
              <p className="subtitle">DM controls</p>
              <div>
                <Button label="Bulk add" icon={<Plus />} onClick={bulkAdd} />
                <Button label="Clear" icon={<Trash2 />} onClick={clear} />
                {isCombatOngoing ? (
                  <Button
                    label="Restart"
                    icon={<RefreshCw />}
                    onClick={restart}
                  />
                ) : null}
              </div>
              <div>
                <Button label="Load" icon={<Upload />} onClick={loadOrder} />
                <Button label="Save" icon={<Save />} onClick={saveOrder} />
                <Button
                  label="Resync"
                  icon={<Loader />}
                  onClick={forceReload}
                />
              </div>
              <Checkbox
                label="TTS"
                checked={shouldTTS}
                onChange={(e) => setShouldTTS(e.target.checked)}
              />
            </>
          ) : null}

          <Checkbox
            label="Auto-scroll"
            checked={shouldScroll}
            onChange={(e) => setShouldScroll(e.target.checked)}
          />

          <div>
            <span className="inline-block align-top mr-4">
              <p className="subtitle mt-4">HP color scale</p>
              <p className={healthColors[0]}>100% - Untouched</p>
              <p className={healthColors[1]}>81-99% - Barely injured</p>
              <p className={healthColors[2]}>61-80% - Lightly injured</p>
              <p className={healthColors[3]}>41-60% - Injured</p>
              <p className={healthColors[4]}>21-40% - Gravely injured</p>
              <p className={healthColors[5]}>1-20% - Near death</p>
              <p className={healthColors[5]}>0% - Unconscious</p>
            </span>
            <span className="inline-block align-top">
              <p className="subtitle mt-4">Characters legend</p>
              <p className="text-enemy">Enemy</p>
              <p className="text-ally">Ally</p>
              <p className="text-player">Player</p>
            </span>
          </div>
        </>
      ) : null}
    </>
  );
}
