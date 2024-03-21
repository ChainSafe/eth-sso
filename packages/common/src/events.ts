import {Transaction, UserAccount} from "./types";

export class ProviderSelectedEvent extends CustomEvent<{url: string}> {
  constructor(providerUrl: string) {
    super('providerSelected', {
      detail: {url: providerUrl},
    });
  }
}

export class UserAccountEvent extends CustomEvent<UserAccount> {
  constructor(account: UserAccount) {
    super('authenticationSuccess', {
      detail: account,
    });
  }
}

export class TransactionEvent extends CustomEvent<Transaction> {
  constructor(transaction: Transaction) {
    super('transactionComplete', {
      detail: transaction,
    });
  }
}
