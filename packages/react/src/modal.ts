import type { EthSSOModalElement, EthSSOProvider } from "@chainsafe/eth-sso-ui";
import { ModalController } from "@chainsafe/eth-sso-ui";

export class EthSSOModal {
  private modalElement?: EthSSOModalElement;

  constructor(
    public options: { providers: EthSSOProvider[]; redirectUrl: string },
  ) {}

  public open(): void {
    console.log("creating element");
    this.modalElement = document.createElement("eth-sso-modal");
    this.modalElement.providers.push(...(this.options?.providers ?? []));
    document.body.insertAdjacentElement("beforeend", this.modalElement);
    ModalController.open();
  }

  public close(): void {
    ModalController.close();
  }
}
