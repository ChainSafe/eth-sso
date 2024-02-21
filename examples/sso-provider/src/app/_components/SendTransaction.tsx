"use client";

import { useCallback, useMemo } from "react";
import { redirect } from "next/navigation";
import { privateKeyToAccount, Transaction } from "web3-eth-accounts";
import { Web3 } from "web3";
import type { SendTransactionRequestSchema } from "@/sendTransaction/types";
import { useWeb3Modal } from "@/hooks/useWeb3Modal";

type Props = SendTransactionRequestSchema;

export default function SendTransaction({
  redirect_uri,
  chain_id,
  transaction,
}: Props): JSX.Element {
  const [provider, isLoading, privateKey] = useWeb3Modal(chain_id);

  const account = useMemo(() => {
    if (!privateKey) return "";
    return privateKeyToAccount("0x" + privateKey);
  }, [privateKey]);

  const tx = useMemo(() => {
    if (!account) return;
    const decodedTransactionData = Transaction.fromSerializedTx(
      Buffer.from(transaction.replace("0x", ""), "hex"),
    );

    return {
      from: account.address,
      ...decodedTransactionData.toJSON(),
    };
  }, [account, transaction]);

  const onClick = useCallback(() => {
    if (!account) return;

    const web3 = new Web3(provider);
    void web3.eth
      .sendTransaction(tx)
      .on("confirmation", ({ confirmations, receipt }) => {
        if (confirmations >= BigInt(1)) {
          const url = new URL("sendTransaction", redirect_uri);
          url.searchParams.set("signer_key", account.address);
          url.searchParams.set(
            "tx_success",
            String(receipt.status === BigInt(1)),
          );
          url.searchParams.set("tx_hash", receipt.transactionHash);

          redirect(url.toString());
        }
      });
  }, [chain_id, transaction, provider, privateKey]);

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
        disabled={isLoading}
        onClick={onClick}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign and Send Transaction
      </button>
    </div>
  );
}
