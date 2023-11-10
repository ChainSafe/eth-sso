'use client';
import React, { useCallback } from 'react';
import './styles.css'; // Import the styles
import getPasskeyCredential from './passkey/getPasskey';
import CreatePassKeyCredential from './passkey/createPasskey';
import generateRandomString from './passkey/entropy';
import { parseUrl } from './sso';

const App = () => {
  if (typeof window !== "undefined") {
    //client side code
    const params = parseUrl();
    if (params != null) {
      console.log(params);
    }
  }


  const generatePasskey = useCallback(async () => {
    const res = await CreatePassKeyCredential(generateRandomString(16));
    console.log(res);
    // 1. create2 to generate smart contract wallet
  }, [])

  const authenticatePasskey = useCallback(async () => {
    const credential = await getPasskeyCredential("test");
    console.log(credential);
    // 1. Custom loookup for samrt wallet based on providers exsiitng infra
  }, [])

  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      <h1 className="title">ETH-SSO</h1>
      <div className="card">
        <p>ETH-SSO</p>
        <button 
          onClick={generatePasskey}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Credential
        </button>
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