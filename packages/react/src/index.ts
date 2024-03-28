import type { EthSSOProvider } from "@chainsafe/eth-sso-ui";
import { ModalController } from "@chainsafe/eth-sso-ui";
import { useState } from "react";
import type {
  Transaction,
  UserAccount,
  UserAccountEvent,
  ProviderSelectedEvent,
  TransactionEvent,
} from "@chainsafe/eth-sso-common";
import { methods } from "@chainsafe/eth-sso-consumer";
import { EthSSOModal } from "./modal";
import { PopupEvents } from "./popupEvents";

let ethSSOModalGlobal: EthSSOModal | undefined = undefined;

export function createEthSSOModal(
  options: ConstructorParameters<typeof EthSSOModal>[0],
): void {
  if (!ethSSOModalGlobal) {
    ethSSOModalGlobal = new EthSSOModal(options);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useEthSSOModal() {
  if (!ethSSOModalGlobal) {
    throw new Error(
      'Please call "createWeb3Modal" before using "useWeb3Modal" hook',
    );
  }

  const [provider, setProvider] = useState<EthSSOProvider | null>(null);

  // eslint-disable-next-line @typescript-eslint/require-await
  async function open(options: { chainId: string }): Promise<void> {
    if (!ethSSOModalGlobal) {
      throw new Error(
        'Please call "createWeb3Modal" before using "useWeb3Modal" hook',
      );
    }
    ethSSOModalGlobal.open();
    const redirectUrl = ethSSOModalGlobal.options.redirectUrl;

    ModalController.events.addEventListener("providerSelected", (evt) => {
      const detail = (evt as CustomEvent<EthSSOProvider>).detail;
      setProvider(detail);

      void methods
        .authenticate(detail.url, redirectUrl, options.chainId)
        .then((event) => {
          PopupEvents.events.dispatchEvent(event);
        });
    });
  }

  async function sendTransaction(options: {
    chainId: string;
    transaction: string;
  }): Promise<void> {
    if (!ethSSOModalGlobal)
      throw new Error(
        'Please call "createWeb3Modal" before using "useWeb3Modal" hook',
      );
    const redirectUrl = ethSSOModalGlobal.options.redirectUrl;
    if (!redirectUrl || !provider)
      throw new Error(
        'Provider not selected, please call "open" from "useWeb3Modal" hook',
      );

    const event = await methods.sendTransaction(
      provider.url,
      redirectUrl,
      options.chainId,
      options.transaction,
    );
    PopupEvents.events.dispatchEvent(event);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async function close(): Promise<void> {
    if (!ethSSOModalGlobal) {
      throw new Error(
        'Please call "createWeb3Modal" before using "useWeb3Modal" hook',
      );
    }
    ethSSOModalGlobal.close();
  }

  function onAuthenticationSuccess(
    callback: (account: UserAccount) => void,
  ): void {
    PopupEvents.events.addEventListener("authenticationSuccess", (evt) => {
      void callback((evt as UserAccountEvent).detail);
    });
  }

  function onProviderSelected(
    callback: (providerUrl: string) => Promise<void> | void,
  ): void {
    ModalController.events.addEventListener("providerSelected", (evt) => {
      void callback((evt as ProviderSelectedEvent).detail.url);
    });
  }

  function onTransactionComplete(
    callback: (transaction: Transaction) => void,
  ): void {
    PopupEvents.events.addEventListener("transactionComplete", (evt) => {
      void callback((evt as TransactionEvent).detail);
    });
  }

  return {
    open,
    close,
    sendTransaction,
    onAuthenticationSuccess,
    onProviderSelected,
    onTransactionComplete,
  };
}
