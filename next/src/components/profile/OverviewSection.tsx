import ProfileCard from './ProfileCard';
import ActivityTimeline from './ActivityTimeline';
import {
    ShoppingCart,
    Wallet,
    Headphones,
    Star,
    ArrowRight
} from 'lucide-react';

export default function OverviewSection() {
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Account Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <ProfileCard
                    title="Recent Orders"
                    value={3}
                    action="View All Orders"
                    icon={ShoppingCart}
                />
                <ProfileCard
                    title="Wallet Balance"
                    value="$245.00"
                    action="Add Funds"
                    icon={Wallet}
                />
                <ProfileCard
                    title="Support Tickets"
                    value={1}
                    action="View Tickets"
                    icon={Headphones}
                />
                <ProfileCard
                    title="Product Reviews"
                    value={12}
                    action="See All Reviews"
                    icon={Star}
                />
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
                <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Recent Activity</h3>
                <ActivityTimeline />
            </div>
        </div>
    );
}