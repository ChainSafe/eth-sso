/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ModalController} from './controller.js';
import {EthSSOProvider} from './types.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('eth-sso-modal')
export class EthSSOModalElement extends LitElement {
  @state() private open = ModalController.state.open;

  @property({type: Array})
  public providers: EthSSOProvider[] = [];

  static override styles = css`
    :host {
      background: none;
      display: block;
      color: black;
      padding: 16px;
      z-index: 999;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    :host .container {
      width: 500px;
      height: 600px;
      background: white;
      border: 5px solid gray;
    }
  `;

  public constructor() {
    super();
    ModalController.onChange('open', (open) => {
      this.open = open;
    });
  }

  override render() {
    console.log({open: this.open});
    return this.open
      ? html`
          <div class="container">
            <h1>Choose your ETH SSO Provider:</h1>
            ${this.providers.map(
              (provider) =>
                html`<button
                  @click=${() => this._handleItemClick(provider.url)}
                >
                  ${provider.url}
                </button>`
            )}
          </div>
        `
      : null;
  }

  private _handleItemClick(providerUrl: string) {
    ModalController.selectProvider(providerUrl);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'eth-sso-modal': EthSSOModalElement;
  }
}
