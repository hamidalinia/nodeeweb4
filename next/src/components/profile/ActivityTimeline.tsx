import {
    Truck,
    Star,
    CreditCard
} from 'lucide-react';

export default function ActivityTimeline() {
    const activities = [
        {
            id: 1,
            action: 'Order Delivered',
            description: 'Order #ORD-12458 has been delivered',
            date: '2 hours ago',
            icon: Truck
        },
        {
            id: 2,
            action: 'Review Submitted',
            description: 'You reviewed "Wireless Headphones"',
            date: '1 day ago',
            icon: Star
        },
        {
            id: 3,
            action: 'Payment Received',
            description: 'Refund of $45.00 processed',
            date: '3 days ago',
            icon: CreditCard
        }
    ];

    return (
        <div className="relative">
            {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                    <div key={activity.id} className={`flex pb-4 ${index !== activities.length - 1 ? 'border-l border-gray-200 pl-4' : 'pl-4'}`}>
                        <div className="absolute left-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                        <div className="w-full">
                            <div className="flex items-center mb-1">
                                <Icon className="text-indigo-600 mr-2 w-4 h-4" />
                                <p className="font-medium text-gray-900 text-sm sm:text-base">{activity.action}</p>
                                <span className="text-gray-500 text-xs ml-auto">{activity.date}</span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">{activity.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}