"use client";
import type { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import {
  ECDSAProvider,
  EmptyAccountSigner,
  SessionKeyProvider,
  getRPCProviderOwner,
} from "@zerodev/sdk";
import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { eth } from "web3";
import * as ethSSO from "./sso";
import "./styles.css"; // Import the styles

const App = (): ReactElement => {
  //hex formatted chain id
  const [chainId, setChainId] = useState("");
  //url to witch redirect along with smart contract account info
  const [redirectUri, setRedirectUri] = useState("");
  // smart contract account address
  const [scwAddress, setScwAddress] = useState("");
  // public key  with root access to smart contract account
  const [signingKey, setSigningKey] = useState("");
  const [sessionPublicKey, setSessionPublicKey] = useState("");
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //client side code
    const params = ethSSO.parseUrl();
    if (params != null) {
      const { redirectUri, chainId, sessionPublicKey } = params;
      //TODO: convert chainId to hex if it isn't
      setChainId(chainId);
      setRedirectUri(redirectUri);
      setSessionPublicKey(sessionPublicKey);
    } else {
      //TODO: handle better
      //maybe for now display overlay with message that params are missing
      // ethSSO.redirectError(redirectUri, "Missing required params");
      window.alert("Missing request query params: " + JSON.stringify(params));
    }
  }, []);

  useEffect(() => {
    if (!chainId) return;
    void (async function () {
      try {
        console.log("Initializing web3auth", { chainId });
        const web3AuthID =
          "BEjNZMt6TPboj3TfHM06MP8Yxz7cKQX6eK3KZzVhrIMi7jALcZHxJv5o3fDLM7EL4QfPlf2AV_qe155vyR3QxiU";
        const instance = new Web3Auth({
          clientId: web3AuthID,
          web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
          chainConfig: {
            chainNamespace: "eip155",
            chainId: chainId,
            rpcTarget: "https://rpc2.sepolia.org",
          },
        });
        await instance.initModal();
        console.log("web3auth initialized");
        setWeb3Auth(instance);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    })();
  }, [chainId]);

  const redirect = (serializedSessionKeyParams: string): void => {
    ethSSO.redirect(
      redirectUri,
      signingKey,
      scwAddress,
      serializedSessionKeyParams,
    );
  };

  const setWallet = useCallback(
    (provider: IProvider) => {
      void (async (): Promise<void> => {
        const ecdsaProvider = await ECDSAProvider.init({
          projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
          owner: getRPCProviderOwner(provider),
        });
        const scwOwnerPk: string = await provider.request({
          method: "eth_private_key", // use "private_key" for other non-evm chains
        });
        setScwAddress(await ecdsaProvider.getAddress());
        setSigningKey(
          eth.accounts.privateKeyToPublicKey("0x" + scwOwnerPk, true),
        );
        const sessionKey = new EmptyAccountSigner(
          sessionPublicKey as `0x${string}`,
        );
        const sessionKeyProvider = await SessionKeyProvider.init({
          defaultProvider: ecdsaProvider,
          sessionKey,
          projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
          sessionKeyData: {
            // The UNIX timestamp at which the session key becomes valid
            validAfter: 0,
            // The UNIX timestamp at which the session key becomes invalid
            validUntil: 0,
            //TODO: configure permissions https://docs.zerodev.app/use-wallets/use-session-keys#signing-the-key-and-its-scope
          },
          usePaymaster: true,
        });

        const serializedSessionKeyParams =
          await sessionKeyProvider.serializeSessionKeyParams();
        redirect(serializedSessionKeyParams);
      })();
    },
    [sessionPublicKey],
  );

  const disconnect = useCallback((): void => {
    if (!web3Auth) return;
    void web3Auth.logout();
    setScwAddress("");
  }, [web3Auth]);

  const handleClick = useCallback((): void => {
    console.log("clicked", web3Auth);
    if (!web3Auth) return;
    setIsLoading(true);
    web3Auth
      .connect()
      .then((provider) => {
        console.log("provider", provider);
        setWallet(provider);
        setIsLoading(false);
      })
      .catch(console.log)
      .finally(() => {
        setIsLoading(false);
      });
  }, [web3Auth]);

  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <h1 className="title">ETH-SSO</h1>
      <div className="card">
        <p>ETH-SSO</p>
        <p>Redirect URI: {redirectUri}</p>
        <p>ChainId: {chainId}</p>
        <p>Smart Wallet Address: {scwAddress}</p>
        <p>Smart Wallet Account Owner: {signingKey}</p>
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
    </div>
  );
};

export default App;
