import { useTranslation } from 'next-i18next';
import type { Option, Combination } from '@/types/product';

type Props = {
    options?: Option[];
    selectedCombination?: Combination | null;
    onOptionChange: (optionName: string, valueName: string) => void;
};

export default function ProductOptions({ options, selectedCombination, onOptionChange }: Props) {
    const { t } = useTranslation('product');

    if (!options || options.length === 0) return null;

    return (
        <>
            {options.map((option) => (
                <div key={option.name} className="mb-6">
                    <h3 className="font-semibold mb-3">{option.name}:</h3>
                    <div className="relative">
                        <select
                            onChange={(e) => onOptionChange(option.name, e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 appearance-none"
                            value={selectedCombination?.options?.[option.name] || ''}
                        >
                            <option value="">{t('selectOption')}</option>
                            {option.values.map((value) => (
                                <option key={value.id} value={value.name} className="flex items-center">
                                    {value.name}
                                </option>
                            ))}
                        </select>

                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}