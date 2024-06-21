import { getCampaigns } from "@/actions/characters";
import { Campaign } from "@/types/API";
import { Db, Document, Filter, MongoClient } from "mongodb";

const mongoURI =
  process.env.MONGODB_URI ?? "mongodb://user:password@localhost:27017";
const dbName = process.env.DB_NAME ?? "fenice2";

const client = new MongoClient(mongoURI, {
  connectTimeoutMS: 2000,
  appName: "Fenice2",
  authSource: dbName,
});
let database: Db;

export async function ourMongo(collection: string) {
  if (database) {
    return database.collection(collection);
  }
  try {
    await client.connect();
    database = client.db(dbName);
    console.info(` ✓ Connected to mongoDB database ${dbName}`);
    return database.collection(collection);
  } catch (err) {
    console.error(` x Failed to connect to the mongoDB database ${dbName}!`);
    console.error(err);
  }
}

export async function getWithFilter(
  collection: string,
  sortingParam?: { field: string; direction: string },
  filter = {} as Filter<Document>
) {
  try {
    const db = await ourMongo(collection);
    const docs = (await db?.find(filter).toArray()) ?? [];

    if (sortingParam && docs.length > 0) {
      if (typeof docs[0][sortingParam.field] === "number") {
        docs.sort((a, b) => a[sortingParam.field] - b[sortingParam.field]);
      } else {
        docs.sort((a, b) =>
          a[sortingParam.field]
            .toString()
            .localeCompare(b[sortingParam.field].toString())
        );
      }
      if (sortingParam.direction == "DESC") {
        docs.reverse();
      }
    }

    return {
      success: true,
      data: docs as any[],
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      data: [],
      message: `Error getting ${collection}: ${err}`,
    };
  }
}

export async function insertDocs(collection: string, docs: any[]) {
  const db = await ourMongo(collection);
  try {
    const result = await db?.insertMany(docs);

    if (result && result.insertedCount > 0) {
      return {
        success: true,
        message: `${result.insertedCount} ${collection} inserted successfully`,
      };
    } else {
      console.error(`Error inserting ${collection}`, result);
      return {
        success: false,
        message: `Error inserting ${collection}: ${result}`,
      };
    }
  } catch (err) {
    console.error(`Error inserting ${collection}`, err);
    return {
      success: false,
      message: `Error inserting ${collection}: ${err}`,
    };
  }
}

export async function updateDoc(
  collection: string,
  doc: any,
  filter = {} as Filter<Document>
) {
  const db = await ourMongo(collection);
  try {
    const result = await db?.replaceOne(filter, doc);

    if (result && result.modifiedCount > 0) {
      return {
        success: true,
        message: `${result.modifiedCount} ${collection} updated successfully`,
      };
    } else {
      console.error(`Error updating ${collection}`, result);
      return {
        success: false,
        message: `Error updating ${collection}: ${result}`,
      };
    }
  } catch (err) {
    console.error(`Error updating ${collection}`, err);
    return {
      success: false,
      message: `Error updating ${collection}: ${err}`,
    };
  }
}

export async function deleteDoc(
  collection: string,
  filter = {} as Filter<Document>
) {
  const db = await ourMongo(collection);
  try {
    const result = await db?.deleteOne(filter);

    if (result && result.deletedCount > 0) {
      return {
        success: true,
        message: `${result.deletedCount} ${collection} deleted successfully`,
      };
    } else {
      console.error(`Error deleting ${collection}`, result);
      return {
        success: false,
        message: `Error deleting ${collection}: ${result}`,
      };
    }
  } catch (err) {
    console.error(`Error deleting ${collection}`, err);
    return {
      success: false,
      message: `Error deleting ${collection}: ${err}`,
    };
  }
}

export async function parseImageFiles(dataArray: File[]) {
  const result = [];
  for (let image of dataArray) {
    const buffer = await image.arrayBuffer();
    if (buffer.byteLength > 0) {
      result.push(
        "data:image/jpeg;base64," + Buffer.from(buffer).toString("base64")
      );
    }
  }
  return result;
}

export async function getDefaultCampaign() {
  const result = await getCampaigns();
  if (!result || result.data.length == 0) {
    throw new Error("Cannot find any campaign");
  }
  const campaign = result.data.reverse()[0] as Campaign;
  return campaign._id;
}

// just to avoid having clear emails in links

const crypto = require("crypto");
const algorithm = "aes256";
const key = process.env.CRYPTO_SECRET ?? "";

export function encrypt(text: string) {
  const cipher = crypto.createCipher(algorithm, key);
  return cipher.update(text, "utf8", "hex") + cipher.final("hex");
}

export function decrypt(text: string) {
  const decipher = crypto.createDecipher(algorithm, key);
  return decipher.update(text, "hex", "utf8") + decipher.final("utf8");
}
