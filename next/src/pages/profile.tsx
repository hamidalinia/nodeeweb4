import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import OverviewSection from '@/components/profile/OverviewSection';
import OrdersSection from '@/components/profile/OrdersSection';
import TransactionsSection from '@/components/profile/TransactionsSection';
import AddressesSection from '@/components/profile/AddressesSection';
import ReviewsSection from '@/components/profile/ReviewsSection';
import SupportTicketsSection from '@/components/profile/SupportTicketsSection';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

// Valid tab IDs for safety check
const VALID_TABS = ['overview', 'orders', 'transactions', 'addresses', 'reviews', 'support'];

function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { t } = useTranslation('common');
    const user = useAppSelector((state) => state.user);
    const [isClient, setIsClient] = useState(false);

    // Get tab from URL or default to 'overview'
    const urlTab = searchParams.get('tab');
    const activeTab = VALID_TABS.includes(urlTab) ? urlTab : 'overview';

    // Check if we're on the client before using router
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Handle tab change - update URL
    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (tab === 'overview') {
            params.delete('tab');
        } else {
            params.set('tab', tab);
        }

        // Use push instead of replace to maintain history
        router.push(`${pathname}?${params.toString()}`);
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (isClient && !user?.token) {
            toast.error(t('profile.loginRequired'));
            router.push('/login');
        }
    }, [isClient, user, router, t]);

    if (!isClient) {
        return (
            <div className="max-w-6xl mx-auto my-12 p-4">
                <p className="text-center">Loading profile...</p>
            </div>
        );
    }

    if (!user?.token) {
        return (
            <div className="max-w-6xl mx-auto my-12 p-4">
                <p className="text-center">{t('profile.redirecting')}</p>
            </div>
        );
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'orders': return <OrdersSection />;
            case 'transactions': return <TransactionsSection />;
            case 'addresses': return <AddressesSection />;
            case 'reviews': return <ReviewsSection />;
            case 'support': return <SupportTicketsSection />;
            default: return <OverviewSection />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <ProfileHeader user={user} />

            {/* Mobile Navigation */}
            <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm">
                <ProfileNavigation
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    isMobile={true}
                />
            </div>

            <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* Desktop Navigation */}
                    <div className="hidden md:block w-full md:w-56 lg:w-64 flex-shrink-0">
                        <ProfileNavigation
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            isMobile={false}
                        />
                    </div>

                    <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm p-3 sm:p-4 md:p-5 lg:p-6">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default ProfilePage