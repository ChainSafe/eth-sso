"use client";

import { ECDSAProvider, getRPCProviderOwner } from "@zerodev/sdk";
import { useCallback } from "react";
import { AccountId } from "caip";
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

      const url = new URL("auth", redirect_uri);
      url.searchParams.set(
        "smart_account_address",
        new AccountId({
          address: contractAddress,
          chainId: `eip155:${chain_id}`,
        }).toString(),
      );

      window.location.assign(url.toString());
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
          Connect Smart Contract Wallet
        </button>
      </div>
    </div>
  );
}
