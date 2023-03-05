import sdk from "./initialize-sdk";
import { readFileSync } from "fs";

(async () => {
  try {
    if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
      throw new Error("Wallet address was not supplied.");
    }

    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "PointlessDAO Membership",
      description: "A DAO with absolutely no point, no purpose.",
      image: readFileSync("scripts/assets/pointless.png"),
      primary_sale_recipient: process.env.WALLET_ADDRESS,
    });

    const editionDrop = await sdk.getContract(
      editionDropAddress,
      "edition-drop"
    );
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed EditionDrop contract: ",
      editionDropAddress
    );
    console.log("✅ EditionDrop Metadata: ", metadata);
  } catch (err) {
    console.error("🔴 Failed to deploy EditionDrop contract: ", err);
  }
})();
