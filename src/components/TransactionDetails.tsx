type Props = {
  tokenName?: string;
  tokenAddress: string;
  recipientCount: number;
  totalAmount: number;
};

export default function TransactionDetails({
  tokenName,
  tokenAddress,
  recipientCount,
  totalAmount,
}: Props) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border w-full mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Transaction Details
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Token:</span>
          <span className="text-gray-900 text-right">{tokenName}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Token Address:</span>
          <span className="text-gray-900 text-right whitespace-nowrap overflow-x-auto max-w-full block">
            {tokenAddress}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">
            Total Airdrop (wei):
          </span>
          <span className="text-gray-900 text-right">
            {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
