import type {UserAccount} from './types';

export const PopupEvents = {
  events: new EventTarget(),

  setAuthentication(account: UserAccount) {
    this.events.dispatchEvent(
      new CustomEvent<UserAccount>('authenticationSuccess', {
        detail: account,
      })
    );
  },
};
