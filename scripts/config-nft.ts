import sdk from "./initialize-sdk";
import { readFileSync } from "fs";

(async () => {
  try {
    if (
      !process.env.EDITION_DROP_ADDRESS ||
      process.env.EDITION_DROP_ADDRESS === ""
    ) {
      throw new Error("Contract address not found.");
    }

    const editionDrop = await sdk.getContract(
      process.env.EDITION_DROP_ADDRESS,
      "edition-drop"
    );

    await editionDrop.createBatch([
      {
        name: "Regularly Pointless",
        description: "An NFT that will give access to PointlessDAO.",
        image: readFileSync("scripts/assets/logo.png"),
      },
    ]);

    console.log("✅ Successfully created a new NFT in the drop.");
  } catch (err) {
    console.error("🔴 Failed to create the new NFT: ", err);
  }
})();
