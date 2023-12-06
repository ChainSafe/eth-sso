"use client";

import { useEthSSOModal, createEthSSOModal } from "@chainsafe/eth-sso-react";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

export default function Home(): ReactElement {
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [signerKey, setSignerKey] = useState("");

  useEffect(() => {
    createEthSSOModal({
      providers: [
        //TODO: enable passing just url instead of object
        { url: "http://localhost:3000" },
        { url: "sso.chainsafe.io" },
        { url: "mpetrunic.eth" },
        { url: "sso.wallet.connect.com" },
      ],
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    void useEthSSOModal().onProviderSelected((url) => {
      console.log("Selected provider: ", url);
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    void useEthSSOModal().onAuthenticationSuccess((account) => {
      setSmartAccountAddress(account.smartAccountAddress);
      setSignerKey(account.signerKey);
    });
  }, []);

  const openModal = useCallback(() => {
    void (async function () {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await useEthSSOModal().open();
    })();
  }, []);

  const closeModal = useCallback(() => {
    void (async function () {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await useEthSSOModal().close();
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {smartAccountAddress && (
        <p>Smart account address: ${smartAccountAddress}</p>
      )}
      {signerKey && <p>Signer key: ${signerKey}</p>}

      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </main>
  );
}
