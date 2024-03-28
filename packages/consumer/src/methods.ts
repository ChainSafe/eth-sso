import {
  UserAccountEvent,
  AbortedEvent,
  TransactionEvent,
} from "@chainsafe/eth-sso-common";
import { onHrefUpdate, windowOpen } from "./utils";

export async function authenticate(
  providerUrl: string,
  redirectUrl: string,
  chainId: string,
): Promise<UserAccountEvent | AbortedEvent> {
  const url = `${providerUrl}/auth?redirect_uri=${redirectUrl}&chain_id=${chainId}`;
  const popup = windowOpen(url);
  if (!popup) throw new Error("Unable to open authentication popup");

  let data;
  await onHrefUpdate(
    popup,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (searchParams) => {
      const smartAccountAddress = searchParams.get("smart_account_address");
      if (smartAccountAddress) {
        data = new UserAccountEvent({ smartAccountAddress });
        return true;
      }
      return false;
    },
    () => {
      data = new AbortedEvent("User closed PopUp");
    },
  );

  if (!data) return new AbortedEvent("Time out");
  return data;
}

export async function sendTransaction(
  providerUrl: string,
  redirectUrl: string,
  chainId: string,
  transaction: string,
): Promise<TransactionEvent | AbortedEvent> {
  const url = `${providerUrl}/sendTransaction?redirect_uri=${redirectUrl}&chain_id=${chainId}&transaction=${transaction}`;
  const popup = windowOpen(url);

  if (!popup) throw new Error("Unable to open authentication popup");

  let data;
  await onHrefUpdate(
    popup,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (searchParams) => {
      const txHash = searchParams.get("tx_hash");
      const smartAccountAddress = searchParams.get("smart_account_address");
      if (txHash && smartAccountAddress) {
        data = new TransactionEvent({ smartAccountAddress, txHash });
        return true;
      }
      return false;
    },
    () => {
      data = new AbortedEvent("User closed PopUp");
    },
  );

  if (!data) return new AbortedEvent("Time out");
  return data;
}
