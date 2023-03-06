import sdk from "./initialize-sdk";

(async () => {
  try {
    if (!process.env.VOTE_ADDRESS || process.env.VOTE_ADDRESS === "") {
      throw new Error("Could not find vote contract address.");
    }

    if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
      throw new Error("Could not find token contract address.");
    }

    const vote = await sdk.getContract(process.env.VOTE_ADDRESS, "vote");
    const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "✅ Successfully gave vote contract permissions to act on token contract."
    );
  } catch (err) {
    console.error(
      "🔴 Failed to grant vote contract permissions on token contract: ",
      err
    );
    process.exit(1);
  }

  try {
    if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
      throw new Error("Could not find wallet address.");
    }

    const vote = await sdk.getContract(process.env.VOTE_ADDRESS, "vote");
    const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

    const ownedAmount = ownedTokenBalance.displayValue;
    const percent50 = (Number(ownedAmount) / 100) * 50;

    await token.transfer(vote.getAddress(), percent50);

    console.log(
      `✅ Successfully transferred ${percent50} $POINTLESS to vote contract.`
    );
  } catch (err) {
    console.error("🔴 Failed to transfer tokens to vote contract: ", err);
  }
})();
