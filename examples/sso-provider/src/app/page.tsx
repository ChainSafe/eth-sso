"use client";
import type { IProvider } from "@web3auth/base";
import { ECDSAProvider, getRPCProviderOwner } from "@zerodev/sdk";
import { ZeroDevWeb3AuthWithModal } from "@zerodev/web3auth";
import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import * as ethSSO from "./sso";
import "./styles.css"; // Import the styles

const App = (): ReactElement => {
  const [chainId, setChainId] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [scwAddress, setScwAddress] = useState("");
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    //client side code
    const params = ethSSO.parseUrl();
    if (params != null) {
      const { redirectUri, chainId } = params;
      setChainId(chainId);
      setRedirectUri(redirectUri);
    }
  }, []);

  const redirect = (): void => {
    if (scwAddress && redirectUri) {
      ethSSO.redirect(redirectUri, "", scwAddress);
    }
  };

  // const generatePasskey = useCallback(async () => {
  //   const credentials = await CreatePassKeyCredential(generateRandomString(16));
  //   if (credentials) {
  //     redirect(credentials);
  //   }
  // }, [])

  // const authenticatePasskey = useCallback(async () => {
  //   try {
  //     const credentials = await getPasskeyCredential("thisisatoughchallenge");
  //     if (credentials) {
  //       redirect(credentials);
  //     }
  //   } catch (e) {
  //     // Need to generate a passkey
  //     await generatePasskey();
  //   }
  // }, [])

  const setWallet = async (provider: IProvider): Promise<void> => {
    const ecdsaProvider = await ECDSAProvider.init({
      projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
      owner: getRPCProviderOwner(provider),
    });
    setScwAddress(await ecdsaProvider.getAddress());
    redirect();
  };

  const zeroDevWeb3Auth = useMemo(() => {
    const instance = new ZeroDevWeb3AuthWithModal(
      [process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID],
      11155111,
    );
    void instance.initialize({
      onConnect: async (): Promise<void> => {
        setIsLoading(true);
        await setWallet(zeroDevWeb3Auth.provider);
        setIsLoading(false);
      },
    });
    return instance;
  }, []);

  const disconnect = (): void => {
    void zeroDevWeb3Auth.logout();
    setScwAddress("");
  };

  const handleClick = (): void => {
    setIsLoading(true);
    zeroDevWeb3Auth
      .login()
      .then(async (provider) => {
        console.log(provider);
        await setWallet(provider);
        setIsLoading(false);
      })
      .catch(console.log)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <h1 className="title">ETH-SSO</h1>
      <div className="card">
        <p>ETH-SSO</p>
        <p>Redirect URI: {redirectUri}</p>
        <p>ChainId: {chainId}</p>
        <p>Smart Wallet Address: {scwAddress}</p>
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
      </div>
    </div>
  );
};

export default App;
