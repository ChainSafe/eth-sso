import type { EthSSOProvider } from "@chainsafe/eth-sso-ui";
import { ModalController } from "@chainsafe/eth-sso-ui";
import { EthSSOModal } from "./modal";

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
  async function open(options: {
    sessionKeyPublic: string;
    chainId: string;
  }): Promise<void> {
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
      }?redirect_uri=${redirectUrl}&chain_id=${options.chainId}`;

      const popup = window.open(
        url,
        "",
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`,
      );

      //TODO: monitor for popup url change (on redirect) best to loop and check every 100ms
      const currentUrl = popup?.location.href;
      if (!currentUrl) {
        return;
      }
      const searchParams = new URL(currentUrl).searchParams;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const scwAddress = searchParams.get("smart_account_address");
    });
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

  function onProviderSelected(
    callback: (providerUrl: string) => Promise<void> | void,
  ): void {
    ModalController.events.addEventListener("providerSelected", (evt) => {
      void callback((evt as CustomEvent<{ url: string }>).detail.url);
    });
  }

  return { open, close, onProviderSelected };
}
