import sdk from "./initialize-sdk";
import { ethers } from "ethers";

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

    const amount = 420_420;
    const description = `Shall we mint ${amount} new $POINTLESS for the treasury?`;

    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to mint $POINTLESS for the treasury."
    );
  } catch (err) {
    console.error("🔴 Failed to create $POINTLESS minting proposal: ", err);
  }

  try {
    if (!process.env.VOTE_ADDRESS || process.env.VOTE_ADDRESS === "") {
      throw new Error("Could not find vote contract address.");
    }

    if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
      throw new Error("Could not find token contract address.");
    }

    if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
      throw new Error("Could not find wallet address.");
    }

    const vote = await sdk.getContract(process.env.VOTE_ADDRESS, "vote");
    const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");

    const amount = 69_420;
    const description = `Should we transfer ${amount} to ${process.env.WALLET_ADDRESS}? He really wants it 🥺`;

    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("transfer", [
          process.env.WALLET_ADDRESS,
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward myself because I am awesome!"
    );
  } catch (err) {
    console.error("🔴 Failed to create $POINTLESS transferral proposal: ", err);
  }
})();
