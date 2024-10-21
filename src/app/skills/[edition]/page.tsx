import { SubtextButton } from "@/components/button";
import Select from "@/components/select";
import { editions } from "@/lib/skills";
import { notFound } from "next/navigation";

interface Props {
  params: { edition: string };
}

export default function SkillsPage({ params }: Readonly<Props>) {
  let { edition } = params;
  const editionData = editions.find((e) => e.id === edition);
  if (!editionData) {
    notFound();
  }

  return (
    <>
      <p className="title">
        Skills{" "}
        <Select
          options={editions.map((edition) => {
            return { name: edition.name, value: edition.id };
          })}
          redirectPath="/skills"
          selectedItem={edition}
        />
      </p>

      <div className="flex flex-wrap justify-center sm:justify-between mt-4">
        {editionData.skills.map((skill) => (
          <SubtextButton
            url={`/skills/${editionData.id}/${skill.name}`}
            title={skill.name}
            subtitle={skill.ability}
            key={skill.name}
          />
        ))}
      </div>
    </>
  );
}
