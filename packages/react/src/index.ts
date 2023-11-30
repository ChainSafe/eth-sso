import { EthSSOProvider, ModalController } from "@chainsafe/eth-sso-ui";
import { EthSSOModal } from "./modal"

declare global {
    interface Window {
      ethSSOModal?: EthSSOModal
    }
  }

export function createEthSSOModal(options?: {
  providers: EthSSOProvider[]
}) {
    if(!window.ethSSOModal) {
      window.ethSSOModal = new EthSSOModal(options);
    }
}

export function useEthSSOModal() {
    if (!window.ethSSOModal) {
      throw new Error('Please call "createWeb3Modal" before using "useWeb3Modal" hook')
    }
  
    async function open() {
      console.log("Modal controller open")
      ModalController.open()
      ModalController.events.addEventListener("providerSelected", (evt) => {
        //open popup
        const width = 600, height = 600
        const left = (window.innerWidth / 2) - (width / 2)
        const top = (window.innerHeight / 2) - (height / 2)
        const url = `${(evt as CustomEvent<EthSSOProvider>).detail.url}?redirect_uri=http://localhost:3001&chain_id=1`
    
        const popup = window.open(url, '',       
          `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`
        )

        //TODO: monitor for popup url change (on redirect) best to loop and check every 100ms
        const currentUrl = popup?.location.href;
        if (!currentUrl) {
          return;
        }
        const searchParams = new URL(currentUrl).searchParams;
        const scwAddress = searchParams.get('smart_account_address');
    })
    }
  
    async function close() {
      ModalController.close()
    }
  
    async function onProviderSelected(callback: (providerUrl: string) => Promise<void>|void) {
      ModalController.events.addEventListener("providerSelected", (evt) => {
          void callback((evt as CustomEvent<{url: string}>).detail.url)
      })
  }

    return { open, close, onProviderSelected }
  }