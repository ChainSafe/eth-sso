import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import type { IProvider } from "@web3auth/base";
import { Web3 } from "web3";
import type { HexString } from "web3";
import { WEB3_AUTH_ID } from "@/lib/constants";

type Return =
  | [Web3, false, HexString, Web3Auth, { provider: IProvider }]
  | [null, true, null, null, { provider: null }];

export function useWeb3(chainId: string): Return {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [privateKey, setPrivateKey] = useState<HexString | null>(null);

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
      .then((web3AuthProvider) => {
        setProvider(web3AuthProvider);
        setWeb3(new Web3(web3AuthProvider));
        void web3AuthProvider
          .request({
            method: "eth_private_key", // use "private_key" for other non-evm chains
          })
          .then(setPrivateKey)
          .then(() => {
            setIsLoading(false);
          });
      });
    setWeb3Auth(instance);
  }, [chainId]);

  if (isLoading) return [null, true, null, null, { provider: null }];
  return [web3, false, privateKey, web3Auth, { provider }];
}
