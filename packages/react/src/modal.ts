import type { EthSSOModalElement, EthSSOProvider } from "@chainsafe/eth-sso-ui";
import { ModalController } from "@chainsafe/eth-sso-ui";

export class EthSSOModal {
  private modalElement: EthSSOModalElement;

  constructor(options?: { providers: EthSSOProvider[] }) {
    this.modalElement = document.createElement("eth-sso-modal");
    this.modalElement.providers.push(...(options?.providers ?? []));
    document.body.insertAdjacentElement("beforeend", this.modalElement);
  }

  public open(): void {
    ModalController.open();
  }

  public close(): void {
    ModalController.close();
  }
}
