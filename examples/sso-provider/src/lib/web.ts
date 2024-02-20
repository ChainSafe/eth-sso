import type { EthExecutionAPI } from "web3";
import { HttpProvider } from "web3";

const DEFAULT_RPC = "wss://ethereum-goerli.publicnode.com";

export function getWeb3Providers(
  chainId: string,
): HttpProvider<EthExecutionAPI> {
  switch (chainId) {
    default:
      return new HttpProvider(DEFAULT_RPC);
  }
}
