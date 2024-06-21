"use client";

import { deleteCharacter } from "@/actions/characters";

import { deleteNpc } from "@/actions/npcs";
import { showAlert } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "react-feather";
import Button from "./button";

interface Props {
  id: string;
  name: string;
  isNpc?: boolean;
}

export default function CharacterButtons({
  id,
  name,
  isNpc = false,
}: Readonly<Props>) {
  const router = useRouter();

  async function handleDelete() {
    showAlert({
      title: `Delete ${isNpc ? "NPC" : "character"}?`,
      text: `Do you really want to delete ${name}? This operation is irreversible!`,
      icon: "warning",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (isNpc) {
          await deleteNpc(id);
          router.push("/npcs");
        } else {
          await deleteCharacter(id);
          router.push("/characters");
        }
      }
    });
  }

  return (
    <div className="text-right">
      <Link
        href={`/${isNpc ? "npcs" : "characters"}/${id}/edit`}
        className="primary button mr-2"
      >
        <Edit />
      </Link>
      <Button onClick={handleDelete} icon={<Trash2 />} />
    </div>
  );
}
