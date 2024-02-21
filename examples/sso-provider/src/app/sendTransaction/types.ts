export interface SendTransactionRequestSchema {
  redirect_uri: string;
  chain_id: string;
  transaction: string;
}
