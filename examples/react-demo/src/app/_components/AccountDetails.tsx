import type { ReactElement } from "react";

interface Props {
  selectedSSOProvider: string;
  smartAccountAddress: string;
  signerKey: string;
}

export function AccountDetails({
  selectedSSOProvider,
  smartAccountAddress,
  signerKey,
}: Props): ReactElement {
  if (!selectedSSOProvider || !smartAccountAddress || !signerKey)
    return <div />;

  return (
    <div className="accountDetails">
      {selectedSSOProvider && (
        <p>Choosen ETH SSO Provider: {selectedSSOProvider}</p>
      )}
      {smartAccountAddress && (
        <p>Smart Contract Account address: {smartAccountAddress}</p>
      )}
      {signerKey && <p>Owner key: {signerKey}</p>}
    </div>
  );
}
