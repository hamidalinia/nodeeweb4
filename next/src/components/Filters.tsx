// components/Filters.tsx
import React from 'react';

interface FiltersProps {
    filters: { [key: string]: any };
    onFilterChange: (key: string, value: string[]) => void;
    selectedFilters: { [key: string]: string[] };
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, selectedFilters }) => {
    return (
        <div className="mb-6">
            {/*{Object.entries(filters).map(([key, values]) => (*/}
                {/*<div key={key} className="mb-4">*/}
                    {/*<h4 className="font-semibold mb-2 capitalize">{key}</h4>*/}
                    {/*<div className="flex flex-wrap gap-2">*/}
                        {/*{values && values?.map((val: string) => (*/}
                            {/*<label key={val} className="flex items-center space-x-2">*/}
                                {/*<input*/}
                                    {/*type="checkbox"*/}
                                    {/*checked={selectedFilters[key]?.includes(val) || false}*/}
                                    {/*onChange={() => {*/}
                                        {/*const current = selectedFilters[key] || [];*/}
                                        {/*if (current.includes(val)) {*/}
                                            {/*onFilterChange(key, current.filter(v => v !== val));*/}
                                        {/*} else {*/}
                                            {/*onFilterChange(key, [...current, val]);*/}
                                        {/*}*/}
                                    {/*}}*/}
                                {/*/>*/}
                                {/*<span>{val}</span>*/}
                            {/*</label>*/}
                        {/*))}*/}
                    {/*</div>*/}
                {/*</div>*/}
            {/*))}*/}
        </div>
    );
};

export default Filters;
