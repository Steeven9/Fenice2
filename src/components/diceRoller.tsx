"use client";

import DiceBox from "@3d-dice/dice-box";
import { AdvancedRoller, DisplayResults } from "@3d-dice/dice-ui";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Button from "./button";
import Select from "./select";

let rollDice = (_notation: string) => {
  // we override this after initialization
  // it's a bit sketchy, but it works
  console.error("Dice not initialized yet");
};

let updateColor = (color: string) => {
  diceBox.updateConfig({ themeColor: color });
};

let diceBox: any;

export default function DiceRoller() {
  const searchParams = useSearchParams();
  const diceString = searchParams!.get("d");

  useEffect(() => {
    diceBox = new DiceBox("#dice-box", {
      assetPath: "/assets/",
      settleTimeout: 2000,
      themeColor: "#1e7098",
    });

    diceBox.init().then(async () => {
      const Display = new DisplayResults("#dice-box");

      const Roller = new AdvancedRoller({
        target: "#dice-box",
        onSubmit: (notation: any) => {
          diceBox.clear();
          Display.clear();
          diceBox.roll(notation);
        },
        onClear: () => {
          diceBox.clear();
          Display.clear();
        },
        onReroll: (rolls: any) => {
          rolls.forEach((roll: any) => diceBox.add(roll));
        },
        onResults: (results: any) => {
          Display.showResults(results);
        },
      });

      rollDice = (notation: string) => {
        Roller.onClear();
        Roller.form.firstElementChild.value = notation;
        Roller.submitForm(new Event("nothing"));
      };

      diceBox.onRollComplete = (results: any) => {
        Roller.handleResults(results);
      };

      if (diceString) {
        rollDice(diceString);
      }
    });
  }, [diceString]);

  const diceOptions = [
    { name: "Blue", value: "#1e7098" },
    { name: "Green", value: "#07fc03" },
    { name: "Orange", value: "#fca503" },
    { name: "Purple", value: "#34035e" },
    { name: "Red", value: "#ff0000" },
  ];

  return (
    <>
      <div>
        <Select
          onChange={(option) => updateColor(option.target.value)}
          options={diceOptions}
          className="align-middle"
        />

        <Button label="Fireball" onClick={() => rollDice("6d6")} />
        <Button label="Holy shit" onClick={() => rollDice("200d20")} />
      </div>

      <div id="dice-box" className="relative"></div>
    </>
  );
}
