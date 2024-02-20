import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import type { IProvider } from "@web3auth/base";
import { WEB3_AUTH_ID } from "@/lib/constants";

type Return = [IProvider, false, Web3Auth] | [null, true, null];

export function useWeb3Modal(chainId: string): Return {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<IProvider | null>();

  useEffect(() => {
    const instance = new Web3Auth({
      clientId: WEB3_AUTH_ID,
      web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
      chainConfig: {
        chainNamespace: "eip155",
        chainId: chainId,
        rpcTarget: "https://rpc2.sepolia.org",
      },
    });

    void instance
      .initModal()
      .then(() => instance.connect())
      .then(setProvider)
      .then(() => {
        setIsLoading(false);
      });
    setWeb3Auth(instance);
  }, [chainId]);

  if (isLoading) return [null, true, null];
  return [provider, false, web3Auth];
}
