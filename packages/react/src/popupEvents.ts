import type { Transaction, UserAccount } from "@chainsafe/eth-sso-common";
import { TransactionEvent, UserAccountEvent } from "@chainsafe/eth-sso-common";

export const PopupEvents = {
  events: new EventTarget(),

  setAuthentication(account: UserAccount) {
    this.events.dispatchEvent(new UserAccountEvent(account));
  },

  setTransaction(transaction: Transaction) {
    this.events.dispatchEvent(new TransactionEvent(transaction));
  },
};
