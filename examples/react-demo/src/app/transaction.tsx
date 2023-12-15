import { useCallback, useState } from "react";
import type { ReactElement } from "react";
import { Button } from "@mui/material";
import type { SessionKeyProvider } from "@zerodev/sdk";
import { eth } from "web3";

type TransactionCardProps = {
  sessionKeyProvider: SessionKeyProvider;
  address: string;
};

export const TransactionCard = ({
  sessionKeyProvider,
  address,
}: TransactionCardProps): ReactElement => {
  const [isSendingTx, setIsSendingTx] = useState(false);

  const onTransactionClick = useCallback(() => {
    setIsSendingTx(true);
    if (!sessionKeyProvider || !address) {
      setIsSendingTx(false);
      return;
    }

    void (async function () {
      const data = eth.abi.encodeFunctionCall(
        {
          name: "mint",
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        [address, "10000000"],
      ) as `0x${string}`;
      const { hash } = await sessionKeyProvider.sendUserOperation({
        target: "0x06a8215666071Af3e7Ee1D32ff17470e45EB97bB",
        data,
      });

      console.log("hash: ", hash);

      await sessionKeyProvider.waitForUserOperationTransaction(
        hash as `0x${string}`,
      );

      setIsSendingTx(false);
    })();
  }, []);

  return (
    <Button
      style={{ margin: "0 10px" }}
      variant="outlined"
      onClick={onTransactionClick}
      disabled={isSendingTx}
    >
      Send Transaction
    </Button>
  );
};
