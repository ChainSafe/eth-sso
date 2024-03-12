"use client";

import { ECDSAProvider, getRPCProviderOwner } from "@zerodev/sdk";
import { useCallback } from "react";
import type { AuthRequestSchema } from "@/auth/types";
import { useWeb3 } from "@/hooks/useWeb3";
import {
  STORAGE_CONNECTION_TIMESTAMP,
  STORAGE_CONTRACT_ADDRESS,
} from "@/lib/constants";

type Props = AuthRequestSchema;

export function Auth({ redirect_uri, chain_id }: Props): JSX.Element {
  const [, isLoading, { provider }] = useWeb3(chain_id);

  const handleConnect = useCallback(() => {
    void (async (): Promise<void> => {
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID,
        owner: getRPCProviderOwner(provider),
      });
      const contractAddress = await ecdsaProvider.getAddress();

      // Local Storage to "persist" connection
      localStorage.setItem(STORAGE_CONTRACT_ADDRESS, contractAddress);
      localStorage.setItem(STORAGE_CONNECTION_TIMESTAMP, String(Date.now()));

      const url = new URL("sendTransaction", redirect_uri);
      url.searchParams.set("address", contractAddress);

      window.location.replace(url.toString());
    })();
  }, [provider]);

  return (
    <div className="card">
      <p>ETH-SSO</p>
      <p>Redirect URI: {redirect_uri}</p>
      <p>ChainId: {chain_id}</p>
      <div>
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Smart Contract Wallet
        </button>
      </div>
    </div>
  );
}
