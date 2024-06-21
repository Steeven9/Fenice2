import { getCampaigns, getCharacters } from "@/actions/characters";
import { getNpcs } from "@/actions/npcs";
import CampaignInfo from "@/components/campaignInfo";
import { Campaign, Character, NPC } from "@/types/API";
import Link from "next/link";

export default async function CampaignsPage() {
  let result = await getCampaigns();
  const campaigns = result.data.reverse() as Campaign[];
  result = await getCharacters();
  const characters = (result.data as Character[]) ?? [];
  result = await getNpcs();
  const npcs = (result.data as NPC[]) ?? [];

  if (campaigns.length == 0) {
    return "No campaigns found";
  }

  return campaigns.map((campaign) => {
    const currentCharacters = characters.filter((char) =>
      char.campaignId.equals(campaign._id)
    );
    const currentNpcs = npcs.filter((npc) =>
      npc.campaignId.equals(campaign._id)
    );
    return (
      <div key={campaign._id!.toString()} className="mb-6">
        <div className="subtitle">{campaign.name}</div>
        <CampaignInfo campaign={campaign} />

        <div className="my-2">
          {`${currentCharacters.length} `}
          <Link
            href={`/characters/by-campaign/${campaign._id}`}
            className="link"
          >
            characters
          </Link>
          {` and ${currentNpcs.length} `}
          <Link href={`/npcs/by-campaign/${campaign._id}`} className="link">
            NPCs
          </Link>
          {" on record"}
        </div>
      </div>
    );
  });
}
