import type { EthSSOProvider } from "@chainsafe/eth-sso-ui";
import { ModalController } from "@chainsafe/eth-sso-ui";
import { useState } from "react";
import { AccountId } from "caip";
import type {
  Transaction,
  UserAccount,
  UserAccountEvent,
  ProviderSelectedEvent,
  TransactionEvent,
} from "@chainsafe/eth-sso-common";
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

function windowOpen(url: string): WindowProxy | null {
  const width = 600,
    height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  return window.open(
    url,
    "",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=yes, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`,
  );
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
      //open popup
      const url = `${
        (evt as CustomEvent<EthSSOProvider>).detail.url
      }/auth?redirect_uri=${redirectUrl}&chain_id=${options.chainId}`;
      const popup = windowOpen(url);

      if (popup) {
        setProvider((evt as CustomEvent<EthSSOProvider>).detail);
        waitAndParsePopupAuthenticationResults(popup);
      } else {
        // TODO: handle error
      }
    });
  }

  function waitAndParsePopupAuthenticationResults(popup: Window): void {
    const initialUrl = popup?.location.href;
    const interval = setInterval(() => {
      try {
        const currentUrl = popup.location.href;
        if (currentUrl && currentUrl !== initialUrl) {
          const searchParams = new URL(currentUrl).searchParams;
          const smartAccountAddressParam = searchParams.get(
            "smart_account_address",
          );
          if (smartAccountAddressParam) {
            PopupEvents.setAuthentication({
              smartAccountAddress: AccountId.parse(smartAccountAddressParam)
                .address,
            });
            clearInterval(interval);
            popup.close();
            void close();
          }
        }
      } catch (e) {
        /* Ignore DOMException while loading */
        if (e instanceof DOMException) {
          return;
        }
        clearInterval(interval);
        popup.close();
        void close();
      }
    }, 100);
    // TODO: Timeout at some point?
  }

  // eslint-disable-next-line @typescript-eslint/require-await
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

    //open popup
    const url = `${provider.url}/sendTransaction?redirect_uri=${redirectUrl}&chain_id=${options.chainId}&transaction=${options.transaction}`;
    const popup = windowOpen(url);

    if (popup) {
      waitAndParsePopupTransactionResults(popup);
    } else {
      // TODO: handle error
    }
  }

  function waitAndParsePopupTransactionResults(popup: Window): void {
    const initialUrl = popup?.location.href;
    const interval = setInterval(() => {
      try {
        const currentUrl = popup.location.href;
        if (currentUrl && currentUrl !== initialUrl) {
          const searchParams = new URL(currentUrl).searchParams;
          const txHash = searchParams.get("tx_hash");
          const smartAccountAddress = searchParams.get("smart_account_address");
          if (txHash && smartAccountAddress) {
            PopupEvents.setTransaction({
              txHash,
              smartAccountAddress,
            });
            clearInterval(interval);
            popup.close();
            void close();
          }
        }
      } catch (e) {
        /* Ignore DOMException while loading */
      }
    }, 100);
    // TODO: Timeout at some point?
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
