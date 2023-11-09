'use client';
import React from 'react';
import './styles.css'; // Import the styles
import getPasskeyCredential from './passkey/getPasskey';
import CreatePassKeyCredential from './passkey/createPasskey';
import generateRandomString from './passkey/entropy';
import { parseUrl } from './sso';

const App = () => {
  
  const params = parseUrl();
  if (params != null) {
    console.log(params);
  }

  const generatePasskey = async () => {
    const res = await CreatePassKeyCredential(generateRandomString(16));
    console.log(res);
  }

  const authenticatePasskey = async () => {
    const credential = await getPasskeyCredential("test");
    console.log(credential);
  }

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