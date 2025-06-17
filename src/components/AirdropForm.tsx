'use client';

import TransactionDetails from '@/components/TransactionDetails';
import InputForm from '@/components/ui/InputForm';
import { chainsToTSender, erc20Abi, tsenderAbi } from '@/constants';
import { calculateTotal } from '@/utils';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useEffect, useMemo, useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import {
  useAccount,
  useChainId,
  useConfig,
  useReadContract,
  useWriteContract,
} from 'wagmi';

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = usePersistentState(
    'tokenAddress',
    ''
  );
  const [recipientAddress, setRecipientAddress] = usePersistentState(
    'recipients',
    ''
  );
  const [amounts, setAmounts] = usePersistentState('amounts', '');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
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

    await waitForTransactionReceipt(config, { hash: airdropHash });
    clearLocalStorage();
    alert('Airdrop successful!');
    setHasSubmitted(true);
  }

  function usePersistentState(key: string, defaultValue: string) {
    const [value, setValue] = useState(() => {
      if (typeof window === 'undefined') return defaultValue;
      return localStorage.getItem(key) || defaultValue;
    });

    useEffect(() => {
      localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
  }

  function clearLocalStorage() {
    localStorage.removeItem('tokenAddress');
    localStorage.removeItem('recipients');
    localStorage.removeItem('amounts');
  }

  const { data: erc20TokenName } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'name',
  }) as { data?: string };

  const { data: erc20TokenBalance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [accountAddress as `0x${string}`],
  }) as { data?: bigint };

  const { data: erc20TokenTotalDecimals } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'decimals',
  }) as { data?: number };

  useEffect(() => {
    if (
      erc20TokenBalance === undefined ||
      erc20TokenTotalDecimals === undefined
    ) {
      setHasSufficientBalance(false);
      return;
    }

    try {
      const balance = parseFloat(
        formatUnits(erc20TokenBalance, erc20TokenTotalDecimals)
      );
      setHasSufficientBalance(balance >= total);
    } catch (error) {
      console.error('Error formatting balance:', error);
      setHasSufficientBalance(false);
    }
  }, [erc20TokenBalance, erc20TokenTotalDecimals, total]);

  return (
    <div className="container mx-auto mt-5 border border-blue-300 rounded-lg bg-white p-4 shadow-sm ">
      <InputForm
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputForm
        label="Recipients (comma or new line separated)"
        placeholder="0x123..., 0x456..."
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        large={true}
      />
      <InputForm
        label="Amounts (wei; comma or new line separated)"
        placeholder="100, 200, 300..."
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
        large={true}
      />
      <TransactionDetails
        tokenName={erc20TokenName || 'ERC20 Token'}
        tokenAddress={tokenAddress}
        recipientCount={recipientAddress.split(/[,\n]+/).length}
        totalAmount={total}
      />
      {hasSubmitted && !hasSufficientBalance ? (
        <button
          className="w-full mt-4 mb-4 px-6 py-3 bg-gray-300 text-gray-600 font-medium rounded-lg cursor-not-allowed"
          disabled
        >
          Insufficient token balance
        </button>
      ) : (
        <button
          className="w-full mt-4 mb-4 px-6 py-3 
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
      )}
    </div>
  );
}
