import type { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";
import type { Network } from "@web3-react/network";
import type { WalletConnect } from "@web3-react/walletconnect";
import type { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import ethers from "ethers";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "../connectors/coinbaseWallet";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import { hooks as networkHooks, network } from "../connectors/network";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect";
import {
  hooks as walletConnectV2Hooks,
  walletConnectV2,
} from "../connectors/walletConnectV2";
import { getName } from "../utils";
import { BlockNumberProvider } from "./BlockNumber";
import { useEffect } from "react";

const connectors: [
  MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];

function Child() {
  const { connector, provider } = useWeb3React();
  console.log(`Priority Connector is: ${getName(connector)}`);

  useEffect(() => {
    if (!provider) return;
    const ttt = setInterval(() => {
      const myProvider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      myProvider.getBlockNumber().then((res) => {
        console.log("自定义当前区块高度", res, "自定义blockNumber多少");
      });
      provider.getBlockNumber("latest").then((blockNumber) => {
        console.log("当前区块高度", blockNumber, "blockNumber多少");
      });
    }, 1000);
    return () => {
      clearInterval(ttt);
    };
  }, [provider]);
  return null;
}

export default function ProviderExample() {
  return (
    <Web3ReactProvider connectors={connectors}>
      <BlockNumberProvider>
        <Child />
      </BlockNumberProvider>
    </Web3ReactProvider>
  );
}
