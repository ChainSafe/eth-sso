export const parseUrl = (): {
  redirectUri: string;
  sessionPublicKey: string;
  chainId: string;
} | null => {
  const queryParameters = new URLSearchParams(window.location.search);
  const redirectUri = queryParameters.get("redirect_uri");
  const chainId = queryParameters.get("chain_id");
  const sessionPublicKey = queryParameters.get("session_public_key");
  if (redirectUri == null || chainId == null || sessionPublicKey == null) {
    return null;
  } else return { redirectUri, chainId, sessionPublicKey };
};

export const redirect = (
  redirectUri: string,
  signerKey: string,
  smartAccountAddress: string,
  serializedSessionKeyParams: string,
): void => {
  if (typeof window !== "undefined") {
    window.location.replace(
      `${redirectUri}?signer_key=${signerKey}&smart_account_address=${smartAccountAddress}&serialized_session_key=${serializedSessionKeyParams}`,
    );
  }
};

export const redirectError = (redirectUri: string, error: string): void => {
  if (typeof window !== "undefined") {
    window.location.replace(`http://${redirectUri}/?error=${error}`);
  }
};
