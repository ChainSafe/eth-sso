import {proxy} from 'valtio/vanilla';
import {subscribeKey} from 'valtio/vanilla/utils';
import type {UserAccount} from './types';

export interface ModalControllerState {
  open: boolean;
}

const state = proxy<ModalControllerState>({
  open: false,
});

export const ModalController = {
  state,

  events: new EventTarget(),
  onChange<K extends keyof ModalControllerState>(
    key: K,
    callback: (value: ModalControllerState[K]) => void
  ) {
    return subscribeKey(state, key, callback);
  },

  open() {
    state.open = true;
  },

  close() {
    state.open = false;
  },

  selectProvider(providerUrl: string) {
    this.events.dispatchEvent(
      new CustomEvent<{url: string}>('providerSelected', {
        detail: {url: providerUrl},
      })
    );
  },

  setAuthentication(account: UserAccount) {
    this.events.dispatchEvent(
      new CustomEvent<UserAccount>('authenticationSuccess', {
        detail: account,
      })
    );
  },
};
