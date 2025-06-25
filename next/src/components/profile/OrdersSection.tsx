export default function OrdersSection() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map((order) => (
                        <tr key={order}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">#ORD-{order}2458</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 15, 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{3} items</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$245.00</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                                <button className="text-gray-600 hover:text-gray-900">Reorder</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <p className="text-sm text-gray-700">Showing 1 to 3 of 12 orders</p>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
                    <button className="px-3 py-1 border rounded-md bg-indigo-600 text-white text-sm">Next</button>
                </div>
            </div>
        </div>
    );
}