import {EthSSOModalElement} from '../src/modal.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {ModalController} from '../src/controller.js';

suite('eth-sso-modal', () => {
  test('is defined', () => {
    const el = document.createElement('eth-sso-modal');
    assert.instanceOf(el, EthSSOModalElement);
  });

  test('renders nothing when closed', async () => {
    const el = await fixture(html`<eth-sso-modal></eth-sso-modal>`);
    assert.shadowDom.equal(el, ``);
  });

  test('renders soemthing when opened', async () => {
    ModalController.open();
    const el = await fixture(html`<eth-sso-modal></eth-sso-modal>`);
    assert.shadowDom.equal(
      el,
      `
    <div class="container">
        <h1>
          Choose your ETH SSO Provider:
        </h1>
      </div>
      `
    );
  });

  test('renders with set providers', async () => {
    ModalController.open();
    const el = await fixture(
      html`<eth-sso-modal .providers="${[{url: 'test.com'}]}"></eth-sso-modal>`
    );
    assert.shadowDom.equal(
      el,
      `
      <div class="container">
        <h1>
          Choose your ETH SSO Provider:
        </h1>
        <button>
          test.com
        </button>
      </div>
    `
    );
  });

  // test('handles a click', async () => {
  //   const el = (await fixture(
  //     html`<eth-sso-modal></eth-sso-modal>`
  //   )) as EthSSOModalElement;
  //   const button = el.shadowRoot!.querySelector('button')!;
  //   button.click();
  //   await el.updateComplete;
  //   assert.shadowDom.equal(
  //     el,
  //     `
  //     <h1>Hello, World!</h1>
  //     <button part="button">Click Count: 1</button>
  //     <slot></slot>
  //   `
  //   );
  // });

  test('styling applied', async () => {
    const el = (await fixture(
      html`<eth-sso-modal></eth-sso-modal>`
    )) as EthSSOModalElement;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
