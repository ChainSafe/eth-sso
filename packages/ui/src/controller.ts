import {proxy} from 'valtio/vanilla';
import {subscribeKey} from 'valtio/vanilla/utils';
import {ProviderSelectedEvent} from '@chainsafe/eth-sso-common';

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

  selectProvider(providerUrl: string, name: string) {
    this.events.dispatchEvent(new ProviderSelectedEvent(providerUrl, name));
    this.close();
  },
};
