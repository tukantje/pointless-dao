import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.error("🔴 Private key not found.");
  process.exit(1);
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.error("🔴 Alchemy API URL not found.");
  process.exit(1);
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.error("🔴 Wallet address not found.");
  process.exit(1);
}

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY,
  process.env.ALCHEMY_API_URL
);

(async () => {
  try {
    const address = await sdk.getSigner()?.getAddress();

    if (address) {
      console.log("👋 SDK initialized by address: ", address);
    } else {
      throw new Error("Could not initialize: No address received.");
    }
  } catch (err) {
    console.error("🔴 Failed to get apps from the sdk: ", err);
    process.exit(1);
  }
})();

export default sdk;
