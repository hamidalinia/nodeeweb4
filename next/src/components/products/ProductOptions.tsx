import { useTranslation } from 'next-i18next';
import type { Option, ProductCombination } from '@/types/product';

export const ProductOptions = ({
                                   options,
                                   selectedCombination,
                                   onOptionChange
                               }: {
    options?: Option[];
    selectedCombination?: ProductCombination | null;
    onOptionChange: (optionName: string, valueName: string) => void;
}) => {
    const { t } = useTranslation('common');

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

                        {selectedCombination?.options?.[option.name] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                                {option.values.find(v => v.name === selectedCombination.options[option.name])?.image && (
                                    <span
                                        className="w-5 h-5 rounded-full border border-gray-300"
                                        style={{
                                            backgroundImage: `url(${option.values.find(v => v.name === selectedCombination.options[option.name])?.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    ></span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};