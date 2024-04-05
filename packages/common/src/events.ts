import type { ProviderSelected, Transaction, UserAccount } from "./types";

/** Work around for Next.js where `CustomEvent` does not exist */
let EventClass: typeof CustomEvent;
try {
  EventClass = CustomEvent;
} catch {
  EventClass = Event as unknown as typeof CustomEvent;
}

export class ETHSSOBaseEventClass<Type> extends EventClass<Type> {
  public stringify(): string {
    return JSON.stringify(
      {
        type: this.type,
        detail: this.detail,
      },
      null,
      2,
    );
  }

  public clone(): { type: string; detail: Type } {
    return {
      type: this.type,
      detail: this.detail,
    };
  }
}

export class ProviderSelectedEvent extends ETHSSOBaseEventClass<ProviderSelected> {
  constructor(providerUrl: string, name: string) {
    super("providerSelected", {
      detail: { url: providerUrl, name },
    });
  }
}

export class UserAccountEvent extends ETHSSOBaseEventClass<UserAccount> {
  constructor(account: UserAccount) {
    super("authenticationSuccess", {
      detail: account,
    });
  }
}

export class TransactionEvent extends ETHSSOBaseEventClass<Transaction> {
  constructor(transaction: Transaction) {
    super("transactionComplete", {
      detail: transaction,
    });
  }
}

export class AbortedEvent extends ETHSSOBaseEventClass<string> {
  constructor(reason: string) {
    super("aborted", {
      detail: reason,
    });
  }
}
