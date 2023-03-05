import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import "./styles/globals.css";

// This is the chain your dApp will work on.
const activeChain = ChainId.Goerli;

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={activeChain}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
