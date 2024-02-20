"use client";

import { useCallback } from "react";
import { redirect } from "next/navigation";
import type { SendTransactionRequestSchema } from "@/sendTransaction/types";
import { useWeb3Modal } from "@/hooks/useWeb3Modal";

type Props = SendTransactionRequestSchema;

export default function SendTransaction({
  redirect_uri,
  chain_id,
  transaction,
}: Props): JSX.Element {
  const [provider] = useWeb3Modal(chain_id);

  const onClick = useCallback(() => {


    void provider
      .sendAsync({
        jsonrpc: "2.0",
        method: "eth_sendRawTransaction",
        params: [transaction],
        id: 1,
      })
      .then((tx) => {
        console.log(tx);

        const url = new URL(redirect_uri);

        redirect(`${redirect_uri}`);
      });
  }, [chain_id, transaction, provider]);

  return (
    <div>
      <button onClick={onClick}>Submit Transaction</button>
      <br />
      <p>{redirect_uri}</p>
      <p>{chain_id}</p>
      <p>{transaction}</p>
    </div>
  );
}
