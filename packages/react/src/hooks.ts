import { parser, utils } from "@chainsafe/eth-sso-sdk";
import { useEffect } from "react";

export function useAuthCallback(
  searchParams = new URLSearchParams(window.location.search),
): void {
  useEffect(() => {
    const auth = parser.parseAuth(searchParams);
    if (auth) utils.postMessage(auth);
  }, [searchParams]);
}

export function useSendTransactionCallback(
  searchParams = new URLSearchParams(window.location.search),
): void {
  useEffect(() => {
    const transaction = parser.parseSendTransaction(searchParams);
    if (transaction) utils.postMessage(transaction);
  }, [searchParams]);
}
