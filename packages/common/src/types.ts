export interface EthSSOProvider {
  logo?: string;
  url: string;
  name: string;
}

export interface ProviderSelected {
  url: string;
  name: string;
}

export interface UserAccount {
  smartAccountAddress: string;
}

export interface Transaction {
  smartAccountAddress: string;
  txHash: string;
}
