"use client";

import { createEthSSOModal, useEthSSOModal } from "@chainsafe/eth-sso-react";
import { Box, Button, Tab, Tabs } from "@mui/material";
import type { ReactElement } from "react";
import { useEffect, useMemo, useCallback, useState } from "react";
import { Transaction as TransactionBuilder } from "web3-eth-accounts";
import type { AbiFunctionFragment } from "web3";
import { Web3, eth } from "web3";
import { toHex } from "web3-utils";
import {
  CHAINSAFE_LOGO_URL,
  CONTRACT_ADDRESS,
  RPC_PROVIDER,
} from "./constants";
import { AccountDetails } from "@/app/_components/AccountDetails";
import { SentForm } from "@/app/_components/SentForm";
import { TransactionDetails } from "@/app/_components/TransactionDetails";
import { CustomTabPanel } from "@/app/_components/CustomTabPanel";
import { SmartContractInteraction } from "@/app/_components/SmartContractInteraction";
import { contractAbi, contractAbiSendMessage } from "@/app/contract.abi";
import type { Message } from "@/app/types";

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
  redirectUrl: "http://localhost:3001/callback/",
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
  const [tab, setTab] = useState(0);
  const [latestMessage, setLatestNessage] = useState<Message | undefined>();

  useEffect(() => {
    onProviderSelected((url) => {
      setSSOProvider(url);
    });
    onAuthenticationSuccess(({ smartAccountAddress }) => {
      setSmartAccountAddress(smartAccountAddress);
    });
  }, []);

  useEffect(() => {
    if (!smartAccountAddress) return;

    const web3 = new Web3(RPC_PROVIDER);
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    const interval = setInterval(() => {
      void contract.methods
        .getLatestMessage()
        .call()
        .then((response) => {
          setLatestNessage({ address: response[0], message: response[1] });
        });
    }, 6000 /* Half Block time on Sepolia */);

    return () => {
      clearInterval(interval);
    };
  }, [smartAccountAddress]);

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
        transaction: toHex(transactionData.serialize()),
      });
      onTransactionComplete(setTx);
    },
    [sendTransaction],
  );

  const sendMessage = useCallback(
    (message: string) => {
      const data = eth.abi.encodeFunctionCall(
        contractAbiSendMessage as AbiFunctionFragment,
        [message],
      );

      const transactionData = new TransactionBuilder({
        to: CONTRACT_ADDRESS,
        data,
      });

      void sendTransaction({
        chainId: SEPOLIA_CHAIN_ID,
        transaction: toHex(transactionData.serialize()),
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
          justifyContent: "center",
          flexDirection: "column",
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
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={(_event, newTab): void => {
                  setTab(newTab as number);
                }}
                aria-label="basic tabs example"
              >
                <Tab label="Transaction" />
                <Tab label="Smart Contract Interaction" />
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              <SentForm onSubmit={sendTx} />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
              <SmartContractInteraction
                onSubmit={sendMessage}
                latestMessage={latestMessage}
              />
            </CustomTabPanel>
          </>
        )}
      </div>
      <AccountDetails
        selectedSSOProvider={selectedSSOProvider}
        smartAccountAddress={smartAccountAddress}
      />
    </main>
  );
}
