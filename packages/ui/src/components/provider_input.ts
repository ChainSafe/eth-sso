import {LitElement, css, html} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {icons} from '../assets/icons';
import {ModalController} from '../controller';

/**
 * Element representing clickable provider button
 */
@customElement('eth-sso-modal-provider-input')
export class EthSSOProviderInput extends LitElement {
  static override styles = css`
    .control {
      box-sizing: border-box;
      clear: both;
      font-size: 1rem;
      position: relative;
      text-align: inherit;
    }

    .provider_url_input {
      width: calc(100% - 3.5rem);
      box-shadow: inset 0 0.0625em 0.125em rgba(10, 10, 10, 0.05);
      background-color: hsl(0deg, 0%, 100%);
      border-color: hsl(0deg, 0%, 86%);
      border-radius: 0.375em;
      color: hsl(0deg, 0%, 21%);
      align-items: center;
      border: 1px solid gray;
      border-radius: 0.375em;
      box-shadow: none;
      font-size: 1rem;
      height: 2.5em;
      justify-content: flex-start;
      line-height: 1.5;
      padding-bottom: calc(0.5em - 1px);
      padding-left: calc(0.75em - 1px);
      padding-right: 2.5em;
      padding-top: calc(0.5em - 1px);
    }

    .proceed-button {
      cursor: pointer;
      height: 2.5em;
      position: absolute;
      top: 0;
      width: 2.5em;
      z-index: 4;
      right: 0;
      padding-bottom: calc(0.5em - 1px);
      padding-left: calc(0.75em - 1px);
      padding-right: calc(0.75em - 1px);
      padding-top: calc(0.5em - 1px);
    }

    .proceed-button:hover {
      transform: scale(1.2);
    }

    .proceed-button svg {
      height: 100%;
      width: 100%;
    }
  `;

  @query('.provider_url_input', true)
  _input!: HTMLInputElement;

  public constructor() {
    super();
  }

  private handleSubmit() {
    //TODO: add validation
    let providerUrl = this._input.value;
    if (!providerUrl.startsWith('http')) {
      providerUrl = 'https://' + providerUrl;
    }
    ModalController.selectProvider(providerUrl, 'Custom Provider');
    this._input.value = '';
  }

  override render() {
    return html` <div class="provider-input-section">
      <h2>Or input url to your provider:</h2>
      <div class="control">
        <form @submit=${this.handleSubmit} onsubmit="return false">
          <input
            class="provider_url_input"
            type="text"
            placeholder="someprovider.com"
            name="provider_url"
          />
          <span @click=${this.handleSubmit} class="proceed-button"
            >${icons.arrow_right}</span
          >
        </form>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'eth-sso-modal-provider-input': EthSSOProviderInput;
  }
}
