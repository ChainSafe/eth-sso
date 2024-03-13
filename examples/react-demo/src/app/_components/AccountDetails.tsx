import type { ReactElement } from "react";

interface Props {
  selectedSSOProvider: string;
  smartAccountAddress: string;
}

export function AccountDetails({
  selectedSSOProvider,
  smartAccountAddress,
}: Props): ReactElement {
  if (!selectedSSOProvider || !smartAccountAddress) return <div />;

  return (
    <div className="accountDetails">
      {selectedSSOProvider && (
        <p>Choosen ETH SSO Provider: {selectedSSOProvider}</p>
      )}
      {smartAccountAddress && (
        <p>Smart Contract Account address: {smartAccountAddress}</p>
      )}
    </div>
  );
}
