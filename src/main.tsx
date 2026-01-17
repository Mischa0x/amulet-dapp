import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App.jsx";
import './index.css';
import './styleguide.css';
import Web3Provider from "./providers/Web3Provider";
import { CreditsProvider } from "./contexts/CreditsContext";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3Provider>
        <CreditsProvider>
          <App />
        </CreditsProvider>
      </Web3Provider>
    </BrowserRouter>
  </React.StrictMode>
);
