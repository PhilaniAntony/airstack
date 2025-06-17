'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain, http } from 'viem';
import { anvil, mainnet, sepolia, zksync } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

const alchemyApikey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
if (!alchemyApikey) {
  throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is not set');
}

// Define chains with proper typing
const configuredChains: Chain[] = [
  {
    ...anvil,
    rpcUrls: {
      default: { http: ['http://localhost:8545'] },
      public: { http: ['http://localhost:8545'] },
    },
  },
  {
    ...zksync,
    rpcUrls: {
      default: {
        http: [`https://zksync-mainnet.g.alchemy.com/v2/${alchemyApikey}`],
      },
      public: {
        http: [`https://zksync-mainnet.g.alchemy.com/v2/${alchemyApikey}`],
      },
    },
  },
  {
    ...mainnet,
    rpcUrls: {
      default: {
        http: [`https://eth-mainnet.g.alchemy.com/v2/${alchemyApikey}`],
      },
      public: {
        http: [`https://eth-mainnet.g.alchemy.com/v2/${alchemyApikey}`],
      },
    },
  },
  {
    ...sepolia,
    rpcUrls: {
      default: {
        http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApikey}`],
      },
      public: {
        http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApikey}`],
      },
    },
  },
];

export default getDefaultConfig({
  appName: 'Airstack | Token Airdrop Automation Platform',
  projectId,
  chains: configuredChains as [Chain, ...Chain[]],
  ssr: false,
  transports: {
    [anvil.id]: http('http://localhost:8545'),
    [zksync.id]: http(
      `https://zksync-mainnet.g.alchemy.com/v2/${alchemyApikey}`
    ),
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApikey}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApikey}`),
  },
});
