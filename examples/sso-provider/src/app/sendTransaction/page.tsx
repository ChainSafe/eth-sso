import type { SendTransactionRequestSchema } from "./types";
import SendTransaction from "@/components/SendTransaction";

interface Props {
  searchParams: Partial<SendTransactionRequestSchema>;
}

export default function SendTransactionPage({
  searchParams,
}: Props): JSX.Element {
  const { redirect_uri, chain_id, transaction } = searchParams;
  if (!redirect_uri || !chain_id || !transaction)
    throw new TypeError("Missing search query");

  return <SendTransaction {...{ redirect_uri, chain_id, transaction }} />;
}
