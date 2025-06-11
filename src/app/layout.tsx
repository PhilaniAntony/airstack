import Header from '@/components/Header';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Airstack | Token Airdrop Automation Platform',
  description:
    'Airstack helps Web3 teams launch, automate, and manage secure token airdrops across multiple blockchains with ease.',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="">
        <Providers>
          <Header />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
