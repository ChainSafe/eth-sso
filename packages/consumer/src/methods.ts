import {
  UserAccountEvent,
  AbortedEvent,
  TransactionEvent,
} from "@chainsafe/eth-sso-common";
import type { Transaction, UserAccount } from "@chainsafe/eth-sso-common";
import { handleRedirect, windowOpen } from "./utils";

export async function authenticate(
  providerUrl: string,
  redirectUrl: string,
  chainId: string,
): Promise<UserAccountEvent | AbortedEvent> {
  const url = `${providerUrl}/auth?redirect_uri=${redirectUrl}&chain_id=${chainId}`;
  const popup = windowOpen(url);
  if (!popup) throw new Error("Unable to open authentication popup");

  let data;
  await handleRedirect(
    popup,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (message: MessageEvent<{ type: string; detail: UserAccount }>) => {
      if (message.data.type && message.data.type === "authenticationSuccess") {
        data = new UserAccountEvent(message.data.detail);
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
  await handleRedirect(
    popup,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (message: MessageEvent<{ type: string; detail: Transaction }>) => {
      if (message.data.type && message.data.type === "transactionComplete") {
        data = new TransactionEvent(message.data.detail);
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
