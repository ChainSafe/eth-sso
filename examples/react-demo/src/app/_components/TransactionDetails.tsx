import { Alert, Box, Button, CircularProgress } from "@mui/material";
import type { ReactElement } from "react";

interface Props {
  txHash?: string;
  txSuccess?: boolean;
  onReset: () => void;
}

export function TransactionDetails({
  txHash,
  txSuccess,
  onReset,
}: Props): ReactElement {
  if (!txSuccess === undefined || !txHash)
    return <CircularProgress color="inherit" />;

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "50ch" },
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
      }}
    >
      {txSuccess ? (
        <Alert severity="success">Transaction success.</Alert>
      ) : (
        <Alert severity="error">Transaction failed.</Alert>
      )}

      <h1>TX Hash: {txHash}</h1>

      <Button style={{ margin: "0 10px" }} variant="outlined" onClick={onReset}>
        Go back
      </Button>
    </Box>
  );
}
