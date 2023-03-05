import sdk from "./initialize-sdk";

(async () => {
  try {
    if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
      throw new Error("Could not find wallet address.");
    }

    const tokenAddress = await sdk.deployer.deployToken({
      name: "Pointless Governance Token",
      symbol: "POINTLESS",
      primary_sale_recipient: process.env.WALLET_ADDRESS,
    });

    console.log("✅ Successfully deployed token contract: ", tokenAddress);
  } catch (err) {
    console.error("🔴 Failed to deploy token contract: ", err);
  }
})();
