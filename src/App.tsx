import {
  ConnectWallet,
  useAddress,
  useContract,
  useNFTBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { useMemo } from "react";
import "./styles/Home.css";

export default function Home() {
  const address = useAddress();
  const editionDropAddress = import.meta.env.VITE_EDITION_DROP_ADDRESS;
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  if (!address) {
    return (
      <div className="container">
        <main className="main">
          <h1 className="title">
            Welcome to <strong>PointlessDAO</strong>!
          </h1>

          <p className="description">
            <strong>PointlessDAO</strong> is, as the name suggests, a DAO
            (decentralised autonomous organisation) with no point nor purpose.
            <br />
            It is purely for educational purposes, and to bring some distraction
            from the cold, rainy Dutch 🇳🇱 weather 😅
          </p>

          <div className="connect">
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="container">
        <main className="main">
          <h1>🫡 Pointless DAO Member Page</h1>
          <p>
            You've made it! It was pointless, but perhaps that was the whole
            idea all along?
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Become Pointless 🔥</h1>
        <div className="btn-hero">
          <Web3Button
            contractAddress={editionDropAddress}
            action={(contract) => {
              contract.erc1155.claim(0, 1);
            }}
            onSuccess={() => {
              if (editionDrop) {
                console.log(
                  `🌊 Successfully minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`
                );
              }
            }}
            onError={(error) => {
              console.error("Failed to mint NFT: ", error);
            }}
          >
            Yes, please 🥰 (0.01 ETH)
          </Web3Button>
        </div>
      </main>
    </div>
  );
}
