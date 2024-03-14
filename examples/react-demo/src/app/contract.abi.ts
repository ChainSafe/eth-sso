export const contractAbiMessageUpdated = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: "address",
      name: "sender",
      type: "address",
    },
    {
      indexed: false,
      internalType: "string",
      name: "message",
      type: "string",
    },
  ],
  name: "MessageUpdated",
  type: "event",
} as const;

export const contractAbiSendMessage = {
  inputs: [
    {
      internalType: "string",
      name: "message",
      type: "string",
    },
  ],
  name: "sendMessage",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
} as const;

export const contractAbiGetLatestMessage = {
  inputs: [],
  name: "getLatestMessage",
  outputs: [
    {
      internalType: "address",
      name: "",
      type: "address",
    },
    {
      internalType: "string",
      name: "",
      type: "string",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

export const contractAbi = [
  contractAbiMessageUpdated,
  contractAbiSendMessage,
  contractAbiGetLatestMessage,
] as const;
