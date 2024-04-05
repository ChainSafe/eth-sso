import { windowOpen, handleRedirect, postMessage } from "./utils";
import { authenticate, sendTransaction } from "./methods";
import { parseSendTransaction, parseAuth } from "./parsers";

export const parser = { parseSendTransaction, parseAuth };

export const methods = { authenticate, sendTransaction };

export const utils = { windowOpen, handleRedirect, postMessage };
