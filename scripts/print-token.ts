import sdk from "./initialize-sdk";

(async () => {
  try {
    if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
      throw new Error("Could not find token contract address.");
    }

    const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");
    const amount = 1_000_000;

    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    console.log(
      `✅ There is now ${totalSupply.displayValue} $POINTLESS in circulation.`
    );
  } catch (err) {
    console.error("🔴 Failed to print tokens: ", err);
  }
})();
