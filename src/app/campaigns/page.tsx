import { getCampaigns, getCharacters } from "@/actions/characters";
import { getNpcs } from "@/actions/npcs";
import CampaignInfo from "@/components/campaignInfo";
import { Campaign, Character, NPC } from "@/types/API";
import Link from "next/link";

export default async function CampaignsPage() {
  let result = await getCampaigns();
  const campaigns = (result.data.reverse() as Campaign[]) ?? [];
  if (campaigns.length == 0) {
    return "No campaigns found";
  }

  result = await getCharacters();
  const characters = (result.data as Character[]) ?? [];
  result = await getNpcs();
  const npcs = (result.data as NPC[]) ?? [];

  // Statistics calculations

  const statusCounts = campaigns.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <div className="title">Campaigns</div>

      <div className="mb-6">
        <div className="subtitle">Stats</div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <span key={status} className="mr-2">
            {status}: {count}
          </span>
        ))}
      </div>

      <div>
        {campaigns.map((campaign) => {
          const currentCharacters = characters.filter((char) =>
            char.campaignId.equals(campaign._id)
          );
          const currentNpcs = npcs.filter((npc) =>
            npc.campaignId.equals(campaign._id)
          );
          return (
            <div key={campaign._id!.toString()} className="mb-6">
              <div className="subtitle">{campaign.name}</div>
              <CampaignInfo campaign={campaign} isCharacterPage={false} />

              <div className="my-2">
                {`${currentCharacters.length} `}
                <Link
                  href={`/characters/by-campaign/${campaign._id}`}
                  className="link"
                >
                  characters
                </Link>
                {` and ${currentNpcs.length} `}
                <Link
                  href={`/npcs/by-campaign/${campaign._id}`}
                  className="link"
                >
                  NPCs
                </Link>
                {" on record"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
