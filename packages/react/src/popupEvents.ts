export interface UserAccount {
  address: string;
}

export interface Transaction {
  txSuccess: boolean;
  txHash: string;
}

export const PopupEvents = {
  events: new EventTarget(),

  setAuthentication(account: UserAccount) {
    this.events.dispatchEvent(
      new CustomEvent<UserAccount>("authenticationSuccess", {
        detail: account,
      }),
    );
  },

  setTransaction(transaction: Transaction) {
    this.events.dispatchEvent(
      new CustomEvent<Transaction>("transactionComplete", {
        detail: transaction,
      }),
    );
  },
};
