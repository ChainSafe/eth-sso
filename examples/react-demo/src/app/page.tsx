"use client";

import { createEthSSOModal, useEthSSOModal } from "@chainsafe/eth-sso-react";
import { Button } from "@mui/material";
import type { ReactElement } from "react";
import { useMemo, useCallback, useEffect, useState } from "react";
import { Transaction } from "web3-eth-accounts";
import { CHAINSAFE_LOGO_URL } from "./constants";
import { AccountDetails } from "@/app/_components/AccountDetails";
import { SentForm } from "@/app/_components/SentForm";

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
  const {
    open,
    transaction,
    onProviderSelected,
    onAuthenticationSuccess,
    onTransactionComplete,
  } = useEthSSOModal();
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

  const isConnected = useMemo(
    () => !selectedSSOProvider || !smartAccountAddress || !signerKey,
    [selectedSSOProvider, smartAccountAddress, signerKey],
  );

  const sendTx = useCallback(
    (to: string, value: number, data?: string) => {
      const transactionData = new Transaction({ to, value, data });

      void transaction({
        chainId: SEPOLIA_CHAIN_ID,
        transaction:
          "0x" + Buffer.from(transactionData.serialize()).toString("hex"),
      });
      onTransactionComplete((tx) => {
        console.log(tx);
      });
    },
    [transaction],
  );

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
        {isConnected ? (
          <Button
            style={{ margin: "0 10px" }}
            variant="outlined"
            onClick={openModalClick}
          >
            Connect Smart Contract Account
          </Button>
        ) : (
          <SentForm onSubmit={sendTx} />
        )}
      </div>
      <AccountDetails
        selectedSSOProvider={selectedSSOProvider}
        smartAccountAddress={smartAccountAddress}
        signerKey={signerKey}
      />
    </main>
  );
}
