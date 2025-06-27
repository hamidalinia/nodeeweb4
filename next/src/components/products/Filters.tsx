// components/Filters.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterValue {
    slug: string;
    name: string;
}
interface FilterGroup {
    name: string;
    values: FilterValue[];
}

interface FiltersProps {
    filters: { [key: string]: FilterGroup };
    onFilterChange: (key: string, value: string[]) => void;
    selectedFilters: { [key: string]: string[] };
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, selectedFilters }) => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    return (
        <div className="w-full md:w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">فیلتر محصولات</h2>

            {Object.entries(filters).map(([key, values]) => {
                const isOpen = openSections[key] ?? true;
                const validValues = Array.isArray(values?.values) ? values.values : [];
                const name = values?.name;

                return (
                    <div key={key} className="mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection(key)}
                        >
                            <h4 className="text-base font-semibold capitalize text-gray-800 dark:text-gray-200">{name}</h4>
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        {isOpen && (
                            <div className="mt-2 max-h-40 overflow-y-auto pr-1 custom-scroll">
                                {validValues.map((val) => (
                                    <label
                                        key={val.slug}
                                        className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-blue-600"
                                            checked={selectedFilters[key]?.includes(val.slug) || false}
                                            onChange={() => {
                                                const current = selectedFilters[key] || [];
                                                if (current.includes(val.slug)) {
                                                    onFilterChange(key, current.filter((v) => v !== val.slug));
                                                } else {
                                                    onFilterChange(key, [...current, val.slug]);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{val.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

};

export default Filters;
