"use client";

import { deleteCharacter } from "@/app/actions";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./button";

interface CharacterButtonsProps {
  id: string;
  name: string;
}

export default function CharacterButtons({
  id,
  name,
}: Readonly<CharacterButtonsProps>) {
  const router = useRouter();

  async function handleDelete() {
    if (
      confirm(
        `Do you really want to delete ${name}? This operation is irreversible!`
      )
    ) {
      await deleteCharacter(id);
      router.push("/characters");
    }
  }

  return (
    <>
      <Link href={`/characters/${id}/edit`} className="primary button mr-2">
        Edit
      </Link>
      <Button onClick={handleDelete} label="Delete" />
    </>
  );
}