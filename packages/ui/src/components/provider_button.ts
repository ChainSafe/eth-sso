import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ModalController} from '../controller';
import {icons} from '../assets/icons';

/**
 * Element representing clickable provider button
 */
@customElement('eth-sso-modal-provider-button')
export class EthSSOProviderButton extends LitElement {
  @property()
  name?: string;

  @property()
  url?: string;

  @property()
  icon?: string;

  static override styles = css`
    button {
      height: 4rem;
      width: 100%;
      background-color: #fff;
      border-color: #dbdbdb;
      border-width: 1px;
      border-radius: 5px;
      cursor: pointer;
      justify-content: center;
      padding-bottom: calc(0.5em - 1px);
      padding-left: 1em;
      padding-right: 1em;
      padding-top: calc(0.5em - 1px);
      text-align: center;
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    button:hover {
      border-color: #b5b5b5;
      background-color: #dbdada;
    }

    div.logo {
      height: 100%;
      display: block;
      width: 3rem !important;
    }

    div.logo svg {
      height: 100%;
      width: 100%;
    }

    div.logo img {
      height: 100%;
      width: 100%;
    }

    div.provider-details {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    p.provider-name {
      width: 100%;
      margin: 0;
      font-size: large;
      font-weight: bold;
    }

    p.provider-url {
      margin: 0;
      width: 100%;
      display: block;
      font-size: small;
    }
  `;

  public constructor() {
    super();
  }

  override render() {
    return html`<button @click=${() => this._handleItemClick(this.url ?? '', this.name ?? 'Undefined')}>
      <div class="logo">
        ${this.icon
          ? html`<img alt="provider icon" src=${this.icon} />`
          : icons.unknownDocument}
      </div>
      <div class="provider-details">
        <p class="provider-name">${this.name ?? 'Undefined'}</p>
        <p class="provider-url">${this.url ?? 'Undefined'}</p>
      </div>
    </button>`;
  }

  private _handleItemClick(providerUrl: string, name: string) {
    ModalController.selectProvider(providerUrl, name);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'eth-sso-modal-provider-button': EthSSOProviderButton;
  }
}
