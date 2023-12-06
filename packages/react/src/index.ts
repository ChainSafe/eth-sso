import type { EthSSOProvider, UserAccount } from "@chainsafe/eth-sso-ui";
import { ModalController, PopupEvents } from "@chainsafe/eth-sso-ui";
import { EthSSOModal } from "./modal";

declare global {
  interface Window {
    ethSSOModal?: EthSSOModal;
  }
}

export function createEthSSOModal(options?: {
  providers: EthSSOProvider[];
}): void {
  if (!window.ethSSOModal) {
    window.ethSSOModal = new EthSSOModal(options);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useEthSSOModal() {
  if (!window.ethSSOModal) {
    throw new Error(
      'Please call "createWeb3Modal" before using "useWeb3Modal" hook',
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async function open(): Promise<void> {
    ModalController.open();
    ModalController.events.addEventListener("providerSelected", (evt) => {
      //open popup
      const width = 600,
        height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      const url = `${
        (evt as CustomEvent<EthSSOProvider>).detail.url
      }?redirect_uri=http://localhost:3001&chain_id=1`;
      // TODO: remove hardcoded dapp

      const popup = window.open(
        url,
        "",
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`,
      );

      if (popup) {
        waitAndParsePopupResults(popup);
      } else {
        // TODO: handle error
      }
    });
  }

  function waitAndParsePopupResults(popup: Window): void {
    const initialUrl = popup?.location.href;
    const interval = setInterval(() => {
      try {
        const currentUrl = popup.location.href;
        if (currentUrl && currentUrl !== initialUrl) {
          const searchParams = new URL(currentUrl).searchParams;
          const smartAccountAddress = searchParams.get("smart_account_address");
          const signerKey = searchParams.get("signer_key");

          if (smartAccountAddress && signerKey) {
            PopupEvents.setAuthentication({
              smartAccountAddress,
              signerKey,
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
    ModalController.close();
  }

  function onAuthenticationSuccess(
    callback: (account: UserAccount) => void,
  ): void {
    PopupEvents.events.addEventListener("authenticationSuccess", (evt) => {
      void callback((evt as CustomEvent<UserAccount>).detail);
    });
  }

  function onProviderSelected(
    callback: (providerUrl: string) => Promise<void> | void,
  ): void {
    ModalController.events.addEventListener("providerSelected", (evt) => {
      void callback((evt as CustomEvent<{ url: string }>).detail.url);
    });
  }

  return { open, close, onAuthenticationSuccess, onProviderSelected };
}
