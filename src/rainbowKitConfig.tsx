'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { anvil, mainnet, sepolia, zksync } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set in environment variables'
  );
}
const alchemyApikey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
if (!alchemyApikey) {
  throw new Error(
    'NEXT_PUBLIC_ALCHEMY_API_KEY is not set in environment variables'
  );
}

// Define custom RPC URLs (use environment variables in production)
const RPC_URLS = {
  [mainnet.id]: 'https://eth-mainnet.g.alchemy.com/v2/' + alchemyApikey,
  [sepolia.id]: 'https://eth-sepolia.g.alchemy.com/v2/' + alchemyApikey,
  [zksync.id]: 'https://zksync-mainnet.g.alchemy.com/v2/' + alchemyApikey,
  [anvil.id]: 'http://localhost:8545',
};

const configuredChains = [
  {
    ...anvil,
    rpcUrls: {
      default: { http: [RPC_URLS[anvil.id]] },
      public: { http: [RPC_URLS[anvil.id]] },
    },
  },
  {
    ...zksync,
    rpcUrls: {
      default: { http: [RPC_URLS[zksync.id]] },
      public: { http: [RPC_URLS[zksync.id]] },
    },
  },
  {
    ...mainnet,
    rpcUrls: {
      default: { http: [RPC_URLS[mainnet.id]] },
      public: { http: [RPC_URLS[mainnet.id]] },
    },
  },
  {
    ...sepolia,
    rpcUrls: {
      default: { http: [RPC_URLS[sepolia.id]] },
      public: { http: [RPC_URLS[sepolia.id]] },
    },
  },
];

export default getDefaultConfig({
  appName: 'Airstack | Token Airdrop Automation Platform',
  projectId,
  chains: configuredChains,
  ssr: false,
  transports: Object.fromEntries(
    configuredChains.map((chain) => [chain.id, http(RPC_URLS[chain.id])])
  ),
});
