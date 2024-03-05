import type { ReactElement } from "react";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

type OnSubmit = (to: string, amount: number, data?: string) => void;

interface Props {
  onSubmit: OnSubmit;
}

export function SentForm({ onSubmit }: Props): ReactElement {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState("");

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "50ch" },
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
      }}
    >
      <TextField
        label="Destination"
        placeholder="0x1e0e2323F326199213ED44Ab1E1f91fc2E4EC64e"
        autoComplete="off"
        value={to}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTo(event.target.value);
        }}
        required
      />
      <TextField
        label="Amount"
        type="number"
        placeholder="0.001"
        autoComplete="off"
        value={amount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setAmount(event.target.value);
        }}
        required
      />
      <TextField
        label="Data"
        placeholder="0x"
        autoComplete="off"
        multiline
        minRows={4}
        value={data}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setData(event.target.value);
        }}
      />
      <Button
        style={{ margin: "0 10px" }}
        variant="outlined"
        onClick={() => {
          onSubmit(to, Number(amount), data);
        }}
      >
        Submit
      </Button>
    </Box>
  );
}
