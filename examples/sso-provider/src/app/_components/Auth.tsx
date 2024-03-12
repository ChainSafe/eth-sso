"use client";

import type { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { ECDSAProvider, getRPCProviderOwner } from "@zerodev/sdk";
import { useCallback, useEffect, useState } from "react";
import { eth } from "web3";
import type { AuthRequestSchema } from "@/auth/types";

type Props = AuthRequestSchema;

export function Auth({ redirect_uri, chain_id }: Props): JSX.Element {
  // smart contract account address
  const [scwAddress, setScwAddress] = useState("");
  // public key  with root access to smart contract account
  const [signerKey, setSignerKey] = useState("");

  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!redirect_uri || !chain_id) {
      // Real provider should handle this nicer
      window.alert("Missing required query params: chain_id, redirect_uri");
    }
  }, [redirect_uri, chain_id]);

  useEffect(() => {
    void (async function () {
      try {
        const web3AuthID =
          "BEjNZMt6TPboj3TfHM06MP8Yxz7cKQX6eK3KZzVhrIMi7jALcZHxJv5o3fDLM7EL4QfPlf2AV_qe155vyR3QxiU";
        const instance = new Web3Auth({
          clientId: web3AuthID,
          web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
          chainConfig: {
            chainNamespace: "eip155",
            chainId: chain_id,
            rpcTarget: "https://rpc2.sepolia.org",
          },
        });
        await instance.initModal();
        setWeb3Auth(instance);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    })();
  }, [chain_id]);

  useEffect(() => {
    if (!isRedirecting && scwAddress && signerKey && chain_id && redirect_uri) {
      setIsRedirecting(true);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          // TODO: change to actual did key format (using multiformats?!)
          window.location.replace(
            `${redirect_uri}?signer_key=${`did:secp256k1:${chain_id}:${signerKey}`}&smart_account_address=${scwAddress}`,
          );
        }
      }, 3000);
    }
  }, [isRedirecting, scwAddress, signerKey, chain_id, redirect_uri]);

  const setWallet = useCallback((provider: IProvider) => {
    void (async (): Promise<void> => {
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
        owner: getRPCProviderOwner(provider),
      });
      const scwOwnerPk: string = await provider.request({
        method: "eth_private_key", // use "private_key" for other non-evm chains
      });

      setScwAddress(await ecdsaProvider.getAddress());
      setSignerKey(eth.accounts.privateKeyToPublicKey("0x" + scwOwnerPk, true));
    })();
  }, []);

  const disconnect = useCallback((): void => {
    if (!web3Auth) return;
    void web3Auth.logout();
    setScwAddress("");
    setSignerKey("");
  }, [web3Auth]);

  const handleClick = useCallback((): void => {
    if (!web3Auth) return;
    setIsLoading(true);
    web3Auth
      .connect()
      .then((provider) => {
        setWallet(provider);
        setIsLoading(false);
      })
      .catch(console.log)
      .finally(() => {
        setIsLoading(false);
      });
  }, [web3Auth, setWallet]);

  return (
    <>
      {isRedirecting ? <b>Connected! Redirecting, please wait...</b> : null}
      <div className="card">
        <p>ETH-SSO</p>
        <p>Redirect URI: {redirect_uri}</p>
        <p>ChainId: {chain_id}</p>
        <p>Smart Wallet Address: {scwAddress}</p>
        <p>Smart Wallet Account Owner: {signerKey}</p>
        {!isLoading ? (
          <div>
            {scwAddress ? (
              <button
                onClick={disconnect}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleClick}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Smart Contract Wallet
              </button>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
