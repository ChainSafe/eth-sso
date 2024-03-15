import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import type { IProvider } from "@web3auth/base";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3 } from "web3";
import { RPC_PROVIDER, WEB3_AUTH_ID } from "@/lib/constants";

type Return =
  | [
      Web3,
      false,
      { provider: IProvider; web3Auth: Web3Auth; publicKey: string },
    ]
  | [null, true, { provider: null; web3Auth: null; publicKey: string }];

export function useWeb3(chainId: string): Return {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    const instance = new Web3Auth({
      clientId: WEB3_AUTH_ID,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Web3Auth Network
      chainConfig: {
        chainNamespace: "eip155",
        chainId: chainId,
        rpcTarget: RPC_PROVIDER,
      },
    });

    void instance
      .initModal()
      .then(() => instance.connect())
      .then((web3AuthProvider) => {
        const web3Instance = new Web3(web3AuthProvider);
        void web3Instance.eth.getAccounts().then((accounts) => {
          setProvider(web3AuthProvider);
          setWeb3(web3Instance as unknown as Web3);
          setPublicKey(accounts[0] || "");
          setIsLoading(false);
        });
      });
    setWeb3Auth(instance);
  }, [chainId]);

  if (isLoading)
    return [null, true, { provider: null, web3Auth: null, publicKey }];
  return [web3, false, { provider, web3Auth, publicKey }];
}
