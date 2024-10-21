import { getCampaigns, getCharacters } from "@/actions/characters";
import CampaignInfo from "@/components/campaignInfo";
import CharacterCard from "@/components/characterCard";
import Select from "@/components/select";
import { Campaign, Character } from "@/types/API";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "react-feather";

interface Props {
  params: { id: string };
}

export default async function CampaignCharactersPage({
  params,
}: Readonly<Props>) {
  let { id } = params;
  let parsedId: ObjectId;
  try {
    parsedId = new ObjectId(id);
  } catch (err) {
    console.error(err);
    notFound();
  }

  const result = await getCharacters(
    {
      field: "name",
      direction: "ASC",
    },
    { campaignId: parsedId }
  );

  const campaigns = await getCampaigns();
  const campaign = campaigns.data.filter((campaign: Campaign) =>
    parsedId.equals(campaign._id)
  )[0] as Campaign;
  if (!campaign) {
    notFound();
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="title">
          Characters{" "}
          <Select
            redirectPath="/characters/by-campaign"
            selectedItem={parsedId.toString()}
            options={campaigns.data.reverse().map((el) => {
              return { name: el.name, value: el._id.toString() };
            })}
          />
        </div>
        <Link
          href={`/characters/new?c=${campaign._id}`}
          className="primary button mb-4"
        >
          <Plus />
        </Link>
      </div>

      <CampaignInfo campaign={campaign} />

      <div className="flex flex-wrap justify-around">
        {result.success
          ? result?.data.map((character: Character) => (
              <CharacterCard
                character={character}
                key={character._id?.toString()}
              />
            ))
          : result.message}
        {result.data.length == 0 ? "No characters found" : ""}
      </div>
    </>
  );
}
