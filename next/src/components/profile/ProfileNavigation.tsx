import { useTranslation } from 'next-i18next';
import {
    LayoutDashboard,
    ShoppingBag,
    Receipt,
    MapPin,
    Star,
    Headphones
} from 'lucide-react';
import CartPage from "../../pages/cart";

const ProfileNavigation = ({
                                              activeTab,
                                              onTabChange,
                                              isMobile
                                          }: {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isMobile: boolean;
})=> {
    const { t } = useTranslation('common');

    const navItems = [
        {
            id: 'overview',
            label: t('overview'),
            icon: LayoutDashboard,
            iconSize: 16
        },
        {
            id: 'orders',
            label: t('orders'),
            icon: ShoppingBag,
            iconSize: 16
        },
        {
            id: 'transactions',
            label: t('transactions'),
            icon: Receipt,
            iconSize: 16
        },
        {
            id: 'addresses',
            label: t('addresses'),
            icon: MapPin,
            iconSize: 16
        },
        {
            id: 'reviews',
            label: t('reviews'),
            icon: Star,
            iconSize: 16
        },
        {
            id: 'support',
            label: t('support'),
            icon: Headphones,
            iconSize: 16
        },
    ];

    if (isMobile) {
        return (
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex space-x-1 min-w-max py-2 px-1">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`px-3 py-2 text-xs sm:text-sm rounded-lg flex flex-col items-center transition-colors ${
                                    activeTab === item.id
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <IconComponent
                                    size={item.iconSize}
                                    className={activeTab === item.id ? 'text-white' : 'text-gray-600'}
                                />
                                <span className="whitespace-nowrap mt-1">{t(item.label)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-3 border-b">
                <h3 className="font-medium text-sm sm:text-base">{t('myAccount')}</h3>
            </div>
            <nav>
                <ul>
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onTabChange(item.id)}
                                    className={`w-full text-left px-3 py-2.5 flex items-center transition-colors text-sm sm:text-base ${
                                        activeTab === item.id
                                            ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <IconComponent
                                        size={18}
                                        className={`mr-2 ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-500'}`}
                                    />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
export default ProfileNavigation;