import type { EthSSOProvider } from "@chainsafe/eth-sso-ui";
import { ModalController } from "@chainsafe/eth-sso-ui";
import { EthSSOModal } from "./modal";
import type { UserAccount } from "./popupEvents";
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
      const width = 600,
        height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      const url = `${
        (evt as CustomEvent<EthSSOProvider>).detail.url
      }/auth?redirect_uri=${redirectUrl}&chain_id=${options.chainId}`;

      const popup = window.open(
        url,
        "",
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=yes, copyhistory=no, width=${width}, 
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
