'use client';
import React, { useCallback, useEffect, useState } from 'react';
import './styles.css'; // Import the styles
import getPasskeyCredential from './passkey/getPasskey';
import CreatePassKeyCredential from './passkey/createPasskey';
import generateRandomString from './passkey/entropy';
import { parseUrl, redirect } from './sso';

const App = () => {
  const [chainId, setChainId] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [passkeyId, setPasskeyId] = useState("");
  const [scwAddress, setScwAddress] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      //client side code
      const params = parseUrl();
      if (params != null) {
        const {redirectUri, chainId} = params;
        setChainId(chainId);
        setRedirectUri(redirectUri);
      }
    }
  },[]);


  const generatePasskey = useCallback(async () => {
    const credentials = await CreatePassKeyCredential(generateRandomString(16));
    // TODO perform some deterministic lookup of a smart contract wallet.
    const samrtWallet = "0x0DA0C3e52C977Ed3cBc641fF02DD271c3ED55aFe";
    if (credentials?.id) {
      setScwAddress(samrtWallet);
      setPasskeyId(credentials.id);
      redirect(redirectUri, credentials.id, samrtWallet);
    }
  }, [])

  const authenticatePasskey = useCallback(async () => {
    try {
      const credentials = await getPasskeyCredential("thisisatoughchallenge");
      // TODO perform some deterministic lookup of a smart contract wallet.
      const samrtWallet = "0x0DA0C3e52C977Ed3cBc641fF02DD271c3ED55aFe";
      if (credentials?.id) {
        setScwAddress(samrtWallet);
        setPasskeyId(credentials.id);
        redirect(redirectUri, credentials.id, samrtWallet);
      }
    } catch (e) {
      // Need to generate a passkey
      await generatePasskey();
    }
  }, [])

  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <h1 className="title">ETH-SSO</h1>
      <div className="card">
        <p>ETH-SSO</p>
        <p>Redirect URI: {redirectUri}</p>
        <p>ChainId: {chainId}</p>
        <p>Passkey ID: {passkeyId}</p>
        <p>Smart Wallet Address: {scwAddress}</p>
        <button 
          onClick={authenticatePasskey}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Authenticate
        </button>
      </div>
    </div>
  );
};

export default App;