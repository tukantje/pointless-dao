import sdk from "./initialize-sdk";
import { MaxUint256 } from "@ethersproject/constants";

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
    const claimConditions = [
      {
        startTime: new Date(),
        maxClaimable: 50_000,
        price: 0.01,
        maxClaimablePerWallet: 1,
        waitInSeconds: MaxUint256,
      },
    ];

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Successfully set claim conditions.");
  } catch (err) {
    console.error("🔴 Failed to set claim conditions: ", err);
  }
})();
