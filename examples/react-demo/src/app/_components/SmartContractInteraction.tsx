import type { ReactElement } from "react";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import type { Message } from "@/app/types";

type OnSubmit = (data: string) => void;

interface Props {
  onSubmit: OnSubmit;
  latestMessage?: Message;
  messages?: Message[];
}

export function SmartContractInteraction({
  onSubmit,
  messages,
  latestMessage,
}: Props): ReactElement {
  const [message, setMessage] = useState("");

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "50ch" },
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
      }}
    >
      {latestMessage && (
        <>
          <p>Latest Message</p>
          <p>Sender: {latestMessage.address}</p>
          <p>Message: {latestMessage.message}</p>
        </>
      )}

      <TextField
        label="Message"
        placeholder="Hello EIP 7555"
        autoComplete="off"
        value={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value);
        }}
        required
      />
      <Button
        style={{ margin: "0 10px" }}
        variant="outlined"
        onClick={() => {
          onSubmit(message);
          setMessage("");
        }}
      >
        Submit
      </Button>

      {messages && messages.length && (
        <>
          <br />
          <p>Previous Messages</p>
          <table className="table-fixed border-spacing-2 border border-slate-400">
            <thead>
              <tr>
                <th className="border border-slate-300">Sender</th>
                <th className="border border-slate-300">Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(({ address, message }, index) => (
                <tr key={index}>
                  <td className="border border-slate-300">{address}</td>
                  <td className="border border-slate-300">{message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Box>
  );
}
