"use client";

import { createEthSSOModal, useEthSSOModal } from "@chainsafe/eth-sso-react";
import { Button } from "@mui/material";
import type { ReactElement } from "react";
import { useMemo, useCallback, useEffect, useState } from "react";
import { Transaction as TransactionBuilder } from "web3-eth-accounts";
import { CHAINSAFE_LOGO_URL } from "./constants";
import { AccountDetails } from "@/app/_components/AccountDetails";
import { SentForm } from "@/app/_components/SentForm";
import { TransactionDetails } from "@/app/_components/TransactionDetails";

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

interface Transaction {
  smartAccountAddress: string;
  txHash: string;
}

export default function Home(): ReactElement {
  const {
    open,
    sendTransaction,
    onProviderSelected,
    onAuthenticationSuccess,
    onTransactionComplete,
  } = useEthSSOModal();
  const [selectedSSOProvider, setSSOProvider] = useState("");
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [tx, setTx] = useState<Transaction | null>(null);

  useEffect(() => {
    onProviderSelected((url) => {
      setSSOProvider(url);
    });
    onAuthenticationSuccess(({ smartAccountAddress }) => {
      setSmartAccountAddress(smartAccountAddress);
    });
  }, []);

  const openModalClick = useCallback(() => {
    //open eth sso modal and pass sessions key and chain id
    void open({
      chainId: SEPOLIA_CHAIN_ID,
    });
  }, [open]);

  const isConnected = useMemo(
    () => !selectedSSOProvider || !smartAccountAddress,
    [selectedSSOProvider, smartAccountAddress],
  );

  const sendTx = useCallback(
    (to: string, value: bigint, data?: string) => {
      const transactionData = new TransactionBuilder({ to, value, data });

      void sendTransaction({
        chainId: SEPOLIA_CHAIN_ID,
        transaction:
          "0x" + Buffer.from(transactionData.serialize()).toString("hex"),
      });
      onTransactionComplete(setTx);
    },
    [sendTransaction],
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ERC4337 + ERC7555</h1>
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
        ) : tx ? (
          <TransactionDetails
            onReset={() => {
              setTx(null);
            }}
            {...tx}
          />
        ) : (
          <SentForm onSubmit={sendTx} />
        )}
      </div>
      <AccountDetails
        selectedSSOProvider={selectedSSOProvider}
        smartAccountAddress={smartAccountAddress}
      />
    </main>
  );
}
