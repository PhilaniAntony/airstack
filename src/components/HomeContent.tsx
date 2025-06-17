'use client';
import AirdropForm from '@/components/AirdropForm';
import { useAccount } from 'wagmi';

export default function HomeContent() {
  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <HomeContent />
      ) : (
        <div className="container mx-auto mt-3">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Airdrop Portal</h1>
          <p className="mb-4">Connect your wallet to participate in the airdrop.</p>
          <AirdropForm />
        </div>

      )}
    </div>
  );
}
