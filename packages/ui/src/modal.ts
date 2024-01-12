import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ModalController} from './controller.js';
import {EthSSOProvider} from './types.js';
import './components/provider_button.js';
import './components/provider_input.js';

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
      z-index: 999;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    :host .container {
      width: 500px;
      height: 400px;
      padding: 2rem;
      background: white;
      border-radius: 6px;
      box-shadow:
        0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  `;

  public constructor() {
    super();
    ModalController.onChange('open', (open) => {
      this.open = open;
    });
  }

  override render() {
    return this.open
      ? html`
          <div class="container">
            <div class="provider-choosing-section">
              <h1>Choose your ETH SSO Provider:</h1>
              ${this.providers.map(
                (provider) =>
                  html`<eth-sso-modal-provider-button
                    name=${provider.name}
                    url=${provider.url}
                    icon=${provider.logo ?? ''}
                  ></eth-sso-modal-provider-button>`
              )}
            </div>
            <eth-sso-modal-provider-input />
          </div>
        `
      : null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'eth-sso-modal': EthSSOModalElement;
  }
}
