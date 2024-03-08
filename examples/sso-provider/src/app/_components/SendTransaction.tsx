"use client";

import {useCallback, useEffect, useState} from "react";
import { Transaction as AccountTransaction } from "web3-eth-accounts";
import type { SendTransactionRequestSchema } from "@/sendTransaction/types";
import { useWeb3 } from "@/hooks/useWeb3";
import { Transaction } from "web3";

type Props = SendTransactionRequestSchema;

export default function SendTransaction({
  redirect_uri,
  chain_id,
  transaction,
}: Props): JSX.Element {
  const [web3, isLoading, { publicKey }] = useWeb3(chain_id);
  const [tx, setTx] = useState<Transaction | null>(null);
  const [sending, setIsSending] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    (async () => {
      const decodedTransactionData = AccountTransaction.fromSerializedTx(
        Buffer.from(transaction.replace("0x", ""), "hex"),
      );

      const decodedTransactionDataJSON = decodedTransactionData.toJSON();
      if (decodedTransactionDataJSON.data.length <= 2) delete decodedTransactionDataJSON.data;

      setTx({
        from: publicKey,
        to: decodedTransactionDataJSON.to,
        value: decodedTransactionDataJSON.value,
        data: decodedTransactionDataJSON.data,
      });
    })();
  }, [publicKey, transaction, isLoading]);

  const onClick = useCallback(() => {
    void web3.eth
      .sendTransaction(tx)
      .then(({ status, transactionHash, }) => {
        const url = new URL("sendTransaction", redirect_uri);
        url.searchParams.set("signer_key", publicKey);
        url.searchParams.set(
          "tx_success",
          String(status === BigInt(1)),
        );
        url.searchParams.set("tx_hash", transactionHash as string);

        if (typeof window !== "undefined") {
          window.location.replace(url.toString());
        }
      });
    setIsSending(true);
  }, [tx]);

  if (!tx) return;
  return (
    <div>
      <table className="table-fixed border-spacing-2 border border-slate-400">
        <thead>
          <tr>
            <th className="border border-slate-300">Key</th>
            <th className="border border-slate-300">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(tx).map((key) => (
            <tr key={key}>
              <td className="border border-slate-300">{key}</td>
              <td className="border border-slate-300">{tx[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button
        disabled={isLoading || sending}
        onClick={onClick}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign and Send Transaction
      </button>
    </div>
  );
}
