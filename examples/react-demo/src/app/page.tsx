"use client";

import { createEthSSOModal, useEthSSOModal } from "@chainsafe/eth-sso-react";
import { Button } from "@mui/material";
import { SessionKeyProvider } from "@zerodev/sdk";
import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { eth } from "web3";

const SEPOLIA_CHAIN_ID = "11155111";

createEthSSOModal({
  providers: [
    //TODO: enable passing just url instead of object
    { url: "localhost:3000" },
    // { url: "sso.chainsafe.io" },
    // { url: "mpetrunic.eth" },
    // { url: "sso.wallet.connect.com" },
  ],
  redirectUrl: "http://localhost:3001",
});

export default function Home(): ReactElement {
  const { open, close } = useEthSSOModal();

  const [sessionKey, setSessionKey] = useState<eth.accounts.Web3Account | null>(
    null,
  );

  const sessionKeyPublic = useMemo(() => {
    if (sessionKey) {
      return eth.accounts.privateKeyToPublicKey(sessionKey.privateKey, false);
    } else {
      return "";
    }
  }, [sessionKey]);

  useEffect(() => {
    //generate sessions key
    setSessionKey(eth.accounts.create());
  }, []);

  useEffect(() => {
    //TODO: move to react SDK
    const searchParams = new URLSearchParams(document.location.search);
    const serializedSessionKey = searchParams.get("serialized_session_key");
    if (!serializedSessionKey || !sessionKey) {
      return;
    }
    const sessionKeyParams = {
      ...SessionKeyProvider.deserializeSessionKeyParams(serializedSessionKey),
      sessionKey: sessionKey.privateKey,
    };

    void (async function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sessionKeyProvider = await SessionKeyProvider.fromSessionKeyParams({
        projectId: "162fa3a7-2e4a-4197-a349-1fff88976340",
        sessionKeyParams,
      });

      // const { hash } = await sessionKeyProvider.sendUserOperation({
      //   // ...use the session key provider as you normally would
      // })
    })();
  }, [sessionKey]);

  const openModalClick = useCallback(() => {
    //open eth sso modal and pass sessions key and chain id
    if (sessionKey) {
      void open({
        chainId: SEPOLIA_CHAIN_ID,
        sessionKeyPublic: eth.accounts.privateKeyToPublicKey(
          sessionKey.privateKey,
          false,
        ),
      });
    }
  }, [open, sessionKey]);

  const closeModalClick = useCallback(() => {
    void close();
  }, [close]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ERC4337 + ERC7555 + Session Keys Demo </h1>
      <div style={{ height: "100px" }}>
        <p>
          This session key is automatically generated and will be added to your
          smart contract account:
        </p>
        <p>
          Session Address: <span>{sessionKey?.address ?? "Generating..."}</span>
        </p>
        <p>
          Session Public Key: <span>{sessionKeyPublic ?? "Generating..."}</span>
        </p>
      </div>
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
    </main>
  );
}
