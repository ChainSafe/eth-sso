# Eth SSO SDK

This is a monorepo project containing Typescript SDK to interact with various SSO providers
as described in [ERC7555](https://github.com/ethereum/ERCs/pull/99). Additionally, it enables
adding sessions keys to smart contract wallets via ETH SSO Provider.

Repository contains multiple packages:

- [@chainsafe/eth-sso-ui](./packages/ui/) - contains Web Components for rendering ETH SSO Provider discovery modal
- [@chainsafe/eth-sso-react](./packages/react) - contains React hooks for interaction with ETH SSO Providers
- [@chainsafe/demo-eth-sso-provider](./examples/sso-provider/) - DO NOT USE IN PRODUCTION! contains simple SSO provider to be used in the demonstration of SDK
- [@chainsafe/eth-sso-react-demo](./examples/react-demo/)- demo react dapp that creates sessions key and uses SDK to attach session key to the smart contract wallet

## Contribution

- run `yarn install`
- run `yarn build:watch` - it will build required packages and watch for changes
- in separate terminal run `yarn demo` to start dapp on localhost:3001