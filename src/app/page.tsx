import { getCampaigns } from "@/actions/characters";
import Countdown from "@/components/countdown";
import { Campaign } from "@/types/API";
import dynamic from "next/dynamic";
import Link from "next/link";

const DiceRoller = dynamic(() => import("@/components/diceRoller"), {
  ssr: false,
});

export default async function Home() {
  // TODO fetch from gcal
  const countdownDate = process.env.NEXT_SESSION_DATE; //"2024-10-30 12:00";

  let result = await getCampaigns(undefined, { status: "Ongoing" });
  const campaigns = (result.data.reverse() as Campaign[]) ?? [];

  return (
    <>
      <div className="title">Welcome!</div>
      <div className="mb-4">
        This is the website for our D&D group. Feel free to start exploring by
        browsing the tabs in the menu! More features to come ＼(＾O＾)／
        <br />
        Audio recording are still hosted on the{" "}
        <Link href="https://lafenice.soulsbros.ch" className="link">
          old website
        </Link>{" "}
        for now.
      </div>

      <div className="subtitle">Active campaigns</div>
      <div className="mb-4">
        {campaigns.length == 0 ? "None for now :(" : null}
        {campaigns.map((campaign) => (
          <div key={campaign._id?.toString()}>
            <Link
              href={`/characters/by-campaign/${campaign._id}`}
              className="link"
            >
              {campaign.name}
            </Link>
          </div>
        ))}
      </div>

      {countdownDate ? (
        <>
          <p className="subtitle">Next session in...</p>
          <Countdown targetDate={countdownDate} />
        </>
      ) : null}

      <div className="subtitle">Roll some dice!</div>
      <DiceRoller />
    </>
  );
}
