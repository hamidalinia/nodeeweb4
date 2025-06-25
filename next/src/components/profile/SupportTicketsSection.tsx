import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export default function SupportTicketsSection() {
    const { t } = useTranslation('common');

    const [tickets, setTickets] = useState([
        {
            id: 'TICK-7821',
            subject: 'Order not delivered',
            status: 'open',
            priority: 'high',
            createdAt: '2025-06-20',
            updatedAt: '2025-06-22',
            messages: [
                {
                    sender: 'You',
                    text: "Hi, I placed an order 5 days ago but it hasn't arrived yet. The tracking shows it was delivered but I never received it.",
                    timestamp: '2025-06-20 14:30'
                },
                {
                    sender: 'Support Agent',
                    text: "We're sorry to hear that. Can you please provide your order number and shipping address?",
                    timestamp: '2025-06-21 10:15'
                }
            ]
        },
        {
            id: 'TICK-7810',
            subject: 'Product damaged',
            status: 'resolved',
            priority: 'medium',
            createdAt: '2025-06-15',
            updatedAt: '2025-06-18',
            messages: []
        }
    ]);

    const [newTicket, setNewTicket] = useState({
        subject: '',
        message: '',
        priority: 'medium'
    });
    const [isCreating, setIsCreating] = useState(false);
    const [activeTicket, setActiveTicket] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');

    const handleCreateTicket = () => {
        if (!newTicket.subject || !newTicket.message) return;

        const ticket = {
            id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: newTicket.subject,
            status: 'open',
            priority: newTicket.priority,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            messages: [{
                sender: 'You',
                text: newTicket.message,
                timestamp: new Date().toISOString()
            }]
        };

        setTickets([ticket, ...tickets]);
        setNewTicket({ subject: '', message: '', priority: 'medium' });
        setIsCreating(false);
        setActiveTicket(ticket.id);
    };

    const handleReply = (ticketId: string) => {
        if (!replyMessage.trim()) return;

        setTickets(tickets.map(ticket => {
            if (ticket.id === ticketId) {
                return {
                    ...ticket,
                    status: 'open',
                    updatedAt: new Date().toISOString().split('T')[0],
                    messages: [
                        ...ticket.messages,
                        {
                            sender: 'You',
                            text: replyMessage,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
            return ticket;
        }));

        setReplyMessage('');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-orange-100 text-orange-800';
            case 'low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('supportTickets')}</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <span className="mr-1">+</span> {t('newTicket')}
                </button>
            </div>

            {isCreating && (
                <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium mb-4">{t('createTicket')}</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('subject')}
                            </label>
                            <input
                                type="text"
                                value={newTicket.subject}
                                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('subjectPlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('priority')}
                            </label>
                            <select
                                value={newTicket.priority}
                                onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="low">{t('low')}</option>
                                <option value="medium">{t('medium')}</option>
                                <option value="high">{t('high')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('message')}
                            </label>
                            <textarea
                                value={newTicket.message}
                                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                                placeholder={t('messagePlaceholder')}
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleCreateTicket}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                            >
                                {t('submitTicket')}
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTicket ? (
                <div>
                    <button
                        onClick={() => setActiveTicket(null)}
                        className="text-indigo-600 mb-4 flex items-center"
                    >
                        <span className="mr-1">←</span> {t('backToTickets')}
                    </button>

                    {tickets
                        .filter(ticket => ticket.id === activeTicket)
                        .map(ticket => (
                            <div key={ticket.id} className="border rounded-lg p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold">{ticket.subject}</h3>
                                        <div className="flex items-center mt-2 space-x-3">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                                            <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                                            <span className="text-gray-500 text-sm">
                        {t('created')}: {ticket.createdAt}
                      </span>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-gray-700">
                                        {t('closeTicket')}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {ticket.messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-lg ${msg.sender === 'You' ? 'bg-indigo-50 self-end ml-10' : 'bg-gray-100 self-start mr-10'}`}
                                        >
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium">{msg.sender}</span>
                                                <span className="text-gray-500 text-sm">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                                            </div>
                                            <p>{msg.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8">
                  <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                      placeholder={t('replyPlaceholder')}
                  />
                                    <button
                                        onClick={() => handleReply(ticket.id)}
                                        className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md"
                                    >
                                        {t('sendReply')}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('ticketId')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('subject')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('priority')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('lastUpdate')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                    {ticket.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {ticket.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.updatedAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => setActiveTicket(ticket.id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {t('view')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}