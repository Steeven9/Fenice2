import Countdown from "@/components/countdown";
import dynamic from "next/dynamic";
import Link from "next/link";

const DiceRoller = dynamic(() => import("@/components/diceRoller"), {
  ssr: false,
});

export default function Home() {
  const countdownDate = ""; //"2024-10-30 12:00";

  return (
    <>
      <p className="title">Welcome!</p>
      <p className="mb-4">
        This is the new site for our D&D group. Feel free to start exploring by
        browsing the tabs in the menu! More features to come ＼(＾O＾)／
        <br />
        Audio recording are still hosted on the{" "}
        <Link href="https://lafenice.soulsbros.ch" className="link">
          old website
        </Link>{" "}
        for now.
      </p>

      {countdownDate ? (
        <>
          <p className="subtitle">Next session in...</p>
          <Countdown targetDate={countdownDate} />
        </>
      ) : null}

      <p className="subtitle">Roll some dice!</p>
      <DiceRoller />
    </>
  );
}
