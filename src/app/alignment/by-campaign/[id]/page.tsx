import { getCampaigns, getCharacters } from "@/actions/characters";
import ActionsHistory from "@/components/alignment/actionsHistory";
import Canvas from "@/components/alignment/canvas";
import CharacterAction from "@/components/alignment/characterAction";
import Select from "@/components/select";
import { Campaign, Character } from "@/types/API";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function AlignmentDetailPage({ params }: Readonly<Props>) {
  let { id } = params;
  let parsedId: ObjectId;
  try {
    parsedId = new ObjectId(id);
  } catch (err) {
    console.error(err);
    notFound();
  }

  const campaigns = await getCampaigns();
  const campaign = campaigns.data.filter((campaign: Campaign) =>
    parsedId.equals(campaign?._id)
  )[0] as Campaign;
  if (!campaign) {
    notFound();
  }

  const result = await getCharacters(
    {
      field: "name",
      direction: "ASC",
    },
    { campaignId: parsedId }
  );
  const characters = result.data as Character[];

  return (
    <>
      <div className="title">
        Alignment chart{" "}
        <Select
          redirectPath="/alignment/by-campaign"
          selectedItem={parsedId.toString()}
          options={campaigns.data.reverse().map((el) => {
            return { name: el.name, value: el._id.toString() };
          })}
        />
      </div>

      <div className="inline-block">
        {characters.length > 0 ? (
          <>
            <Canvas characters={characters} />
            <CharacterAction characters={characters} />
          </>
        ) : (
          <div>No characters found</div>
        )}
      </div>

      {characters.length > 0 ? (
        <ActionsHistory characters={characters} />
      ) : null}
    </>
  );
}
