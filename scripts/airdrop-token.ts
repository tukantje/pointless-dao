import sdk from "./initialize-sdk";

(async () => {
  try {
    if (
      !process.env.EDITION_DROP_ADDRESS ||
      process.env.EDITION_DROP_ADDRESS === ""
    ) {
      throw new Error("Could not find EditionDrop contract address.");
    }

    if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
      throw new Error("Could not find token contract address.");
    }

    const editionDrop = await sdk.getContract(
      process.env.EDITION_DROP_ADDRESS,
      "edition-drop"
    );
    const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      throw new Error("No claimed NFTs found.");
    }

    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random amount between 1_000 and 10_000
      const randomAmount = Math.floor(
        Math.random() * (10_000 - 1_000 + 1) + 1_000
      );
      console.log(
        `🛫 Going to airdrop ${randomAmount} $POINTLESS to ${address}`
      );

      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);

    console.log("✅ Successfully airdropped tokens to all holders.");
  } catch (err) {
    console.error("🔴 Failed to airdrop tokens: ", err);
  }
})();
