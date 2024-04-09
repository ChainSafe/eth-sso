"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthCallback } from "@chainsafe/eth-sso-react";

export default function AuthCallback(): ReactElement {
  const searchParams = useSearchParams();
  useAuthCallback(searchParams);

  return <div />;
}
