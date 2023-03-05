import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import "./styles/Home.css";

export default function Home() {
  const address = useAddress();
  console.log("👋 Address: ", address);

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

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Connected as {address}, now what? 👀</h1>
      </main>
    </div>
  );
}
