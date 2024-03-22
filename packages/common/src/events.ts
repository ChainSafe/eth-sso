import {ProviderSelected, Transaction, UserAccount} from "./types";

/** Work around for NextJS where `CustomEvent` does not exist */
const EventClass = CustomEvent || Event;

export class ProviderSelectedEvent extends EventClass<ProviderSelected> {
  constructor(providerUrl: string, name: string) {
    super('providerSelected', {
      detail: {url: providerUrl, name},
    });
  }
}

export class UserAccountEvent extends EventClass<UserAccount> {
  constructor(account: UserAccount) {
    super('authenticationSuccess', {
      detail: account,
    });
  }
}

export class TransactionEvent extends EventClass<Transaction> {
  constructor(transaction: Transaction) {
    super('transactionComplete', {
      detail: transaction,
    });
  }
}

export class AbortedEvent extends EventClass<string> {
  constructor(reason: string) {
    super('aborted', {
      detail: reason,
    });
  }
}
