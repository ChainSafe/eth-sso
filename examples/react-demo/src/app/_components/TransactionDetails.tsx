import { Box, Button, CircularProgress } from "@mui/material";
import type { ReactElement } from "react";

interface Props {
  txHash?: string;
  onReset: () => void;
}

export function TransactionDetails({ txHash, onReset }: Props): ReactElement {
  if (!txHash) return <CircularProgress color="inherit" />;

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "50ch" },
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
      }}
    >
      <h1>TX Hash: {txHash}</h1>

      <Button style={{ margin: "0 10px" }} variant="outlined" onClick={onReset}>
        Go back
      </Button>
    </Box>
  );
}
