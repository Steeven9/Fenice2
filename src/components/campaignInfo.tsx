import { Campaign } from "@/types/API";
import Link from "next/link";

interface Props {
  campaign: Campaign;
}

const formatDateString = (campaign: Campaign) => {
  let dateString = "";
  if (campaign.startDate == null && campaign.endDate == null) {
    return ` - Unknown date`;
  }
  if (campaign.startDate?.toISOString() == campaign.endDate?.toISOString()) {
    return ` - The ${campaign.startDate.toLocaleDateString("en-CH")}`;
  }
  if (campaign.startDate != null) {
    dateString += ` - From ${campaign.startDate.toLocaleDateString("en-CH")}`;
  }
  if (campaign.endDate != null) {
    dateString += ` to ${campaign.endDate.toLocaleDateString("en-CH")}`;
  }
  return dateString;
};

export default function CampaignInfo({ campaign }: Readonly<Props>) {
  return (
    <div className="my-2">
      DM: {campaign.dm} - Type: {campaign.type}
      {campaign.ruleset != "" ? ` - Ruleset: ${campaign.ruleset}` : null}
      {formatDateString(campaign)} ({campaign.status}
      {campaign.endLevel ? ` at level ${campaign.endLevel}` : null})
      <Link
        href={`/alignment/by-campaign/${campaign._id}`}
        className="primary button"
      >
        Alignment
      </Link>
      {campaign.wikiLink ? (
        <Link
          href={campaign.wikiLink}
          className="primary button"
          target="_blank"
        >
          Wiki page
        </Link>
      ) : null}
    </div>
  );
}
