import "../styles.css";
import type { AuthRequestSchema } from "./types";
import { Auth } from "@/components/Auth";

interface Props {
  searchParams: Partial<AuthRequestSchema>;
}

export default function AuthPage({ searchParams }: Props): JSX.Element {
  const { redirect_uri, chain_id } = searchParams;
  if (!redirect_uri || !chain_id) throw new TypeError("Missing search query");

  return <Auth {...{ redirect_uri, chain_id }} />;
}
