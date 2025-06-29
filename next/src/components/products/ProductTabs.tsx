import { useTranslation } from 'next-i18next';
import type { TabItem } from '@/types/ui';

type Props = {
    tabs: TabItem[];
    activeTab: number;
    onTabChange: (index: number) => void;
};

export default function ProductTabs({ tabs, activeTab, onTabChange }: Props) {
    const { t } = useTranslation('product');

    return (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px space-x-8">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(index)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === index
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="py-6">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}