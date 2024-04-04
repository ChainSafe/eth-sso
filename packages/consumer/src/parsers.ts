import { TransactionEvent, UserAccountEvent } from "@chainsafe/eth-sso-common";

export function parseSendTransaction(
  searchParams: URLSearchParams,
): TransactionEvent | false {
  const txHash = searchParams.get("tx_hash");
  const smartAccountAddress = searchParams.get("smart_account_address");
  if (txHash && smartAccountAddress)
    return new TransactionEvent({ smartAccountAddress, txHash });

  return false;
}

export function parseAuth(
  searchParams: URLSearchParams,
): UserAccountEvent | false {
  const smartAccountAddress = searchParams.get("smart_account_address");
  if (smartAccountAddress) return new UserAccountEvent({ smartAccountAddress });

  return false;
}
