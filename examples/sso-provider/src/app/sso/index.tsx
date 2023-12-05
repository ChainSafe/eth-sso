export const parseUrl = (): { redirectUri: string; chainId: string } => {
  const queryParameters = new URLSearchParams(window.location.search);
  const redirectUri = queryParameters.get("redirect_uri");
  const chainId = queryParameters.get("chain_id");
  if (redirectUri == null || chainId == null) {
    return null;
  } else return { redirectUri, chainId };
};

export const redirect = (
  redirectUri: string,
  signer_uid: string,
  smartAccountAddress: string,
): void => {
  if (typeof window !== "undefined") {
    window.location.replace(
      `${redirectUri}/?signer_uid=${signer_uid}&smart_account_address=${smartAccountAddress}`,
    );
  }
};
