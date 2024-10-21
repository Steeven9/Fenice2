"use client";

import { sounds } from "@/lib/sounds";
import { useEffect, useState } from "react";

export default function SoundsPage() {
  const [audio, setAudio] = useState<HTMLAudioElement>();

  function playSound(src: string) {
    audio!.src = src;
    audio!.play();
  }

  useEffect(() => {
    setAudio(document.getElementById("player")! as HTMLAudioElement);
  }, []);

  return (
    <>
      <div className="title">Soundboard</div>
      <div className="text-center">
        {sounds.map((sound) => (
          <button
            className="button primary"
            key={sound.name}
            onClick={() => playSound(sound.url)}
          >
            {sound.name}
          </button>
        ))}
      </div>
      <audio id="player" controls className="hidden" />
    </>
  );
}
