'use client';

import InputField from '@/components/ui/InputField';
import { chainsToTSender, erc20Abi, tsenderAbi } from '@/constants';
import { calculateTotal } from '@/utils';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useMemo, useState } from 'react';
import { isAddress } from 'viem';
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi';

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amounts, setAmounts] = useState('');
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();
  const config = useConfig();
  const chains = chainsToTSender[chainId];
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  async function getApprovedAmount(
    tsenderAddress: string | null
  ): Promise<number> {
    if (!tsenderAddress || !accountAddress || !tokenAddress) return 0;
    if (
      !isAddress(tokenAddress) ||
      !isAddress(tsenderAddress) ||
      !isAddress(accountAddress)
    )
      return 0;

    try {
      const response = await readContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [accountAddress, tsenderAddress as `0x${string}`],
      });
      return Number(response);
    } catch (error) {
      console.error('Error reading allowance:', error);
      return 0;
    }
  }

  async function handleSubmit() {
    if (!chainId || !chainsToTSender[chainId]) {
      alert('Unsupported chain');
      return;
    }

    const tsenderAddress = chainsToTSender[chainId]['tsender'];
    const approvedAmount = await getApprovedAmount(tsenderAddress);

    const recipients = recipientAddress
      .split(/[,\n]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr !== '');

    const amountList = amounts
      .split(/[,\n]+/)
      .map((amt) => amt.trim())
      .filter((amt) => amt !== '');

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [tsenderAddress as `0x${string}`, BigInt(total)],
      });

      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log('Approval successful:', approvalReceipt);
    }

    const airdropHash = await writeContractAsync({
      abi: tsenderAbi,
      address: tsenderAddress as `0x${string}`,
      functionName: 'airdropERC20',
      args: [tokenAddress, recipients, amountList, BigInt(total)],
    });

    const airdropReceipt = await waitForTransactionReceipt(config, {
      hash: airdropHash,
    });
    console.log('Airdrop successful:', airdropReceipt);
  }

  return (
    <div>
      <InputField
        label="Token Address"
        placeholder="0x..."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients"
        placeholder="0x1234,0x1234234"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <InputField
        label="Amounts"
        placeholder="0.0"
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
      />
      <button
        className="px-6 py-3 
        bg-blue-600 hover:bg-blue-700 
        text-white font-medium rounded-lg 
        transition-colors duration-200
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
