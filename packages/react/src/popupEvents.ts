export interface UserAccount {
  signerKey: string;
  smartAccountAddress: string;
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
};
