"use client";

import { useEthSSOModal, createEthSSOModal } from "@chainsafe/eth-sso-react";
import type { ReactElement } from "react";
import { useCallback, useEffect } from "react";

export default function Home(): ReactElement {
  useEffect(() => {
    createEthSSOModal({
      providers: [
        //TODO: enable passing just url instead of object
        { url: "localhost:3000" },
        { url: "sso.chainsafe.io" },
        { url: "mpetrunic.eth" },
        { url: "sso.wallet.connect.com" },
      ],
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    void useEthSSOModal().onProviderSelected((url) => {
      console.log("Selected provider: ", url);
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
      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </main>
  );
}
