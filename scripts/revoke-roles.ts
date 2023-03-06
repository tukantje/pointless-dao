import sdk from "./initialize-sdk";

(async () => {
  try {
    if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
      throw new Error("Could not find token contract address.");
    }

    const token = await sdk.getContract(process.env.TOKEN_ADDRESS, "token");
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles that exist at the moment: ", allRoles);

    await token.roles.setAll({ admin: [], minter: [] });

    console.log(
      "🎉 Roles after revoking ourselves from power: ",
      await token.roles.getAll()
    );
    console.log(
      "✅ Successfully revoked our superpowers from the ERC-20 contract."
    );
  } catch (err) {
    console.error("🔴 Failed to revoke ourselves from the DAO treasury: ", err);
  }
})();
