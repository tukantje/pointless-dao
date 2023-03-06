import sdk from "./initialize-sdk";

const ONE_DAY_IN_BLOCKS = 6570;

(async () => {
  try {
    if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
      throw new Error("Could not find token address.");
    }

    const voteContractAddress = await sdk.deployer.deployVote({
      name: "Pointless DAO",
      voting_token_address: process.env.TOKEN_ADDRESS,
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: ONE_DAY_IN_BLOCKS,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Successfully deployed vote contract: ",
      voteContractAddress
    );
  } catch (err) {
    console.error("🔴 Failed to deploy vote contract: ", err);
  }
})();
