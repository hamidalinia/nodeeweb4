import { useTranslation } from 'next-i18next';

export default function TransactionsSection() {
    const { t } = useTranslation();

    const transactions = [
        { id: 'TXN-4892', date: '2025-06-15', amount: 125.99, status: 'completed', type: 'payment' },
        { id: 'TXN-4891', date: '2025-06-10', amount: 45.00, status: 'refunded', type: 'refund' },
        { id: 'TXN-4890', date: '2025-06-05', amount: 89.99, status: 'completed', type: 'payment' },
    ];

    const statusColors = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        refunded: 'bg-blue-100 text-blue-800',
        failed: 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">{t('transactions')}</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('transactionId')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('date')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('type')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('amount')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('invoice')}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((txn) => (
                        <tr key={txn.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                {txn.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {txn.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                {txn.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${txn.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[txn.status as keyof typeof statusColors]}`}>
                    {txn.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button className="text-indigo-600 hover:text-indigo-900">
                                    {t('download')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    {t('showingTransactions', { count: transactions.length, total: 12 })}
                </p>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded-md text-sm">
                        {t('previous')}
                    </button>
                    <button className="px-3 py-1 border rounded-md bg-indigo-600 text-white text-sm">
                        {t('next')}
                    </button>
                </div>
            </div>
        </div>
    );
}