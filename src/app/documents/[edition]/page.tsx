import { getFiles } from "@/actions/storage";
import { SubtextButton } from "@/components/button";
import Select from "@/components/select";
import { editions } from "@/lib/skills";
import { cleanDocTitle } from "@/lib/utils";
import { notFound } from "next/navigation";

interface Props {
  params: { edition: string };
}

export default async function DocumentsPage({ params }: Readonly<Props>) {
  let { edition } = params;
  const editionString = editions.find((ed) => ed.id === edition)?.name;
  if (!editionString) {
    notFound();
  }

  const docs = await getFiles(`docs/${edition}`);

  return (
    <>
      <div className="title">
        Documents{" "}
        <Select
          options={editions.map((edition) => {
            return { name: edition.name, value: edition.id };
          })}
          redirectPath="/documents"
          selectedItem={edition}
        />
      </div>

      {docs.length == 0 ? (
        "No documents found"
      ) : (
        <div className="flex flex-wrap justify-center sm:justify-between mt-4">
          {docs.map(async (doc) => {
            return (
              <SubtextButton
                url={`/documents/viewer/${encodeURIComponent(doc)}`} // to avoid slashes breaking the URL we encode it
                title={cleanDocTitle(doc).title}
                subtitle={cleanDocTitle(doc).category}
                key={doc}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
