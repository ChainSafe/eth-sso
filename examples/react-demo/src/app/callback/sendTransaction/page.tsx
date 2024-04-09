"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { useSendTransactionCallback } from "@chainsafe/eth-sso-react";

export default function SendTransactionCallback(): ReactElement {
  const searchParams = useSearchParams();
  useSendTransactionCallback(searchParams);

  return <div />;
}
