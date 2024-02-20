"use client";

import { useCallback } from "react";
import { redirect } from "next/navigation";
import { Transaction } from "web3-eth-accounts";
import type { SendTransactionRequestSchema } from "@/sendTransaction/types";
import { useWeb3Modal } from "@/hooks/useWeb3Modal";

type Props = SendTransactionRequestSchema;

export default function SendTransaction({
  redirect_uri,
  chain_id,
  transaction,
}: Props): JSX.Element {
  const [provider, isLoading, privateKey] = useWeb3Modal(chain_id);

  const onClick = useCallback(() => {
    // TODO: make it works
    const transactionData = Transaction.fromSerializedTx(
      Uint8Array.from(Buffer.from(transaction.substring(2), "hex")),
    );
    void provider
      .sendAsync({
        jsonrpc: "2.0",
        method: "eth_sendRawTransaction",
        params: [
          transactionData.sign(Uint8Array.from(Buffer.from(privateKey, "hex"))),
        ],
        id: 1,
      })
      .then((tx) => {
        const url = new URL("sendTransaction", redirect_uri);
        url.searchParams.set("signer_key", "");
        url.searchParams.set("smart_account_address", "");
        url.searchParams.set("tx_success", String(true));
        url.searchParams.set("tx_hash", "");

        redirect(url.toString());
      });
  }, [chain_id, transaction, provider, privateKey]);

  return (
    <div>
      <button disabled={isLoading} onClick={onClick}>
        Submit Transaction
      </button>
      <br />
      <br />
      <p>{redirect_uri}</p>
      <p>{chain_id}</p>
      <p>{transaction}</p>
    </div>
  );
}
