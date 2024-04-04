import { parser } from "@chainsafe/eth-sso-consumer";
import { useEffect } from "react";

export function useAuthCallback(
  searchParams = new URLSearchParams(window.location.search),
): void {
  useEffect(() => {
    const auth = parser.parseAuth(searchParams);
    if (auth) {
      if (window.opener) window.opener.postMessage(auth.clone());
      else window.parent.postMessage(auth.clone());
    }
  }, [searchParams]);
}

export function useSendTransactionCallback(searchParams = new URLSearchParams(window.location.search)): void {
  useEffect(() => {
    const transaction = parser.parseSendTransaction(searchParams);
    if (transaction) {
      if (window.opener) window.opener.postMessage(transaction.clone());
      else window.parent.postMessage(transaction.clone());
    }
  }, [searchParams]);
}
