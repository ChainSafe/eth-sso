"use client";

import { createEthSSOModal, useEthSSOModal } from "@chainsafe/eth-sso-react";
import { Button } from "@mui/material";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { CHAINSAFE_LOGO_URL } from "./constants";
import { AccountDetails } from "@/app/_components/AccountDetails";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

createEthSSOModal({
  providers: [
    //TODO: enable passing just url instead of object
    {
      url: "http://localhost:3000",
      name: "ChainSafe Provider",
      logo: CHAINSAFE_LOGO_URL,
    },
    // { url: "sso.chainsafe.io" },
    // { url: "mpetrunic.eth" },
    // { url: "sso.wallet.connect.com" },
  ],
  redirectUrl: "http://localhost:3001",
});

export default function Home(): ReactElement {
  const { open, close, onProviderSelected, onAuthenticationSuccess } =
    useEthSSOModal();
  const [selectedSSOProvider, setSSOProvider] = useState("");
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [signerKey, setSignerKey] = useState("");

  useEffect(() => {
    onProviderSelected((url) => {
      setSSOProvider(url);
    });
    onAuthenticationSuccess((account) => {
      setSmartAccountAddress(account.smartAccountAddress);
      setSignerKey(account.signerKey);
    });
  }, []);

  const openModalClick = useCallback(() => {
    //open eth sso modal and pass sessions key and chain id
    void open({
      chainId: SEPOLIA_CHAIN_ID,
    });
  }, [open]);

  const closeModalClick = useCallback(() => {
    void close();
  }, [close]);

  //TODO: add button for sending transaction
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ERC4337 + ERC7555 + Session Keys Demo </h1>
      <div
        style={{
          display: "flex",
          height: "50px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Button
          style={{ margin: "0 10px" }}
          variant="outlined"
          onClick={openModalClick}
        >
          Connect Smart Contract Account
        </Button>
        <Button
          style={{ margin: "0 10px" }}
          variant="outlined"
          onClick={closeModalClick}
        >
          Close Modal
        </Button>
      </div>
      <AccountDetails
        selectedSSOProvider={selectedSSOProvider}
        smartAccountAddress={smartAccountAddress}
        signerKey={signerKey}
      />
    </main>
  );
}
