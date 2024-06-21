"use server";

import { authOptions } from "@/lib/authConfig";
import {
  deleteDoc,
  getWithFilter,
  insertDocs,
  parseImageFiles,
  updateDoc,
} from "@/lib/mongo";
import { parseFormData } from "@/lib/utils";
import { NPC } from "@/types/API";
import { Document, Filter, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getNpcs(
  sortingParam?: { field: string; direction: string },
  filter = {} as Filter<Document>
) {
  return await getWithFilter("npcs", sortingParam, filter);
}

export async function insertNpc(prevState: any, formData: FormData) {
  const userData = await getServerSession(authOptions);

  if (!userData) {
    return { message: "Error: invalid user data. Try logging out and back in" };
  }
  if (
    !formData.get("name") ||
    !formData.get("race") ||
    !formData.get("class")
  ) {
    return { message: "Error: missing required data" };
  }

  const formImages = formData.getAll("images") as File[];
  let images = await parseImageFiles(formImages);

  const npc: NPC = {
    campaignId: new ObjectId(parseFormData(formData, "campaignId")),
    name: parseFormData(formData, "name"),
    race: parseFormData(formData, "race", true),
    gender: parseFormData(formData, "gender", true),
    pronouns: parseFormData(formData, "pronouns", true),
    orientation: parseFormData(formData, "orientation", true),
    class: parseFormData(formData, "class", true),
    status: parseFormData(formData, "status", true),
    backstory: parseFormData(formData, "backstory"),
    personality: parseFormData(formData, "personality"),
    images: images,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: userData?.user.email,
  };

  const result = await insertDocs("npcs", [npc]);
  revalidatePath("/npcs");

  if (result.success) {
    redirect(`/npcs/by-campaign/${npc.campaignId}`);
  }
  return { message: result.message };
}

export async function updateNpc(prevState: any, formData: FormData) {
  const userData = await getServerSession(authOptions);
  const id = new ObjectId(parseFormData(formData, "_id"));
  const oldData = await getNpcs(undefined, {
    _id: id,
  });
  const npc = oldData.data[0] as NPC;

  if (!oldData.success) {
    return { message: "Error: invalid NPC ID" };
  }
  if (!userData) {
    return { message: "Error: invalid user data. Try logging out and back in" };
  }
  if (
    !formData.get("name") ||
    !formData.get("race") ||
    !formData.get("class")
  ) {
    return { message: "Error: missing one or more required fields" };
  }

  const formImages = formData.getAll("images") as File[];
  let images = [...npc.images, ...(await parseImageFiles(formImages))];

  npc.name = parseFormData(formData, "name") ?? npc.name;
  npc.pronouns = parseFormData(formData, "pronouns", true) ?? npc.pronouns;
  npc.orientation =
    parseFormData(formData, "orientation", true) ?? npc.orientation;
  npc.gender = parseFormData(formData, "gender", true) ?? npc.gender;
  npc.race = parseFormData(formData, "race", true) ?? npc.race;
  npc.class = parseFormData(formData, "class", true) ?? npc.class;
  npc.status = parseFormData(formData, "status", true) ?? npc.status;
  npc.backstory = parseFormData(formData, "backstory") ?? npc.backstory;
  npc.personality =
    formData.get("personality")?.toString().trim() ?? npc.personality;
  npc.campaignId = new ObjectId(parseFormData(formData, "campaignId"));
  npc.updatedAt = new Date();
  npc.updatedBy = userData?.user.email;
  npc.images = images;

  const result = await updateDoc("npcs", npc, {
    _id: id,
  });
  revalidatePath("/npcs");

  if (result.success) {
    redirect(`/npcs/by-campaign/${npc.campaignId}`);
  }
  return { message: result.message };
}

export async function deleteNpc(id: string) {
  const userData = await getServerSession(authOptions);
  const oldData = await getNpcs(undefined, {
    _id: new ObjectId(id),
  });
  const npc = oldData.data[0] as NPC;

  if (!oldData.success) {
    return { message: "Error: invalid NPC ID" };
  }
  if (!userData) {
    return { message: "Error: invalid user data. Try logging out and back in" };
  }

  const result = await deleteDoc("npcs", {
    _id: new ObjectId(id),
  });
  revalidatePath("/npcs");

  if (result.success) {
    redirect(`/npcs/by-campaign/${npc.campaignId}`);
  }
  return { message: result.message };
}
