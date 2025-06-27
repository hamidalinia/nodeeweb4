// components/checkout/AddressStep.tsx
import React, { useState } from 'react';
import DeliveryForm from './DeliveryForm';
import { ThemeData } from '@/types/themeData';

const AddressStep = ({
                         theme,
                         t,
                         addresses,
                         selectedAddress,
                         addressLoading,
                         handleAddressSelect,
                         handleNewAddressSubmit,
                         lang
                     }: {
    theme: ThemeData;
    t: (key: string) => string;
    addresses: any[];
    selectedAddress: any;
    addressLoading: boolean;
    handleAddressSelect: (address: any) => void;
    handleNewAddressSubmit: (address: any) => void;
    lang: 'fa' | 'en';
}) => {
    const [showAddressForm, setShowAddressForm] = useState(false);
const themeMode=theme?.mode;
    return (
        <div className={`p-6 rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('shippingAddress')}</h2>
                {addresses.length > 0 && !showAddressForm && (
                    <button
                        className={`px-4 py-2 rounded-lg font-medium flex items-center text-sm ${
                            themeMode === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => setShowAddressForm(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        {t('addNewAddress')}
                    </button>
                )}
            </div>

            {addressLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : showAddressForm ? (
                <div className="mb-6">
                    <DeliveryForm
                        theme={theme}
                        onSubmit={handleNewAddressSubmit}
                        lang={lang}
                        showCancel={true}
                        onCancel={() => setShowAddressForm(false)}
                    />
                </div>
            ) : addresses.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">{t('selectAddress')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedAddress?.id === address.id
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                                        : themeMode === 'dark'
                                        ? 'border-gray-700 hover:border-gray-500'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                onClick={() => handleAddressSelect(address)}
                            >
                                <div className="font-medium flex items-center">
                                    {address.fullName}
                                    {address.isDefault && (
                                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            {t('default')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm mt-2">
                                    {address.address}, {address.city}
                                </div>
                                <div className="text-sm mt-1">{address.phone}</div>
                                <div className="text-sm mt-1">{address.postalCode}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-6">
                    <DeliveryForm
                        theme={theme}
                        onSubmit={handleNewAddressSubmit}
                        lang={lang}
                        showCancel={false}
                    />
                </div>
            )}

            <div className="flex justify-between items-center mt-6">
                <div className="text-xl font-semibold"></div>
                {addresses.length > 0 && !showAddressForm && (
                    <button
                        className={`px-4 py-2 rounded-lg font-medium flex items-center text-sm ${
                            themeMode === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}

                        onClick={() => handleAddressSelect(addresses[0])}
                    >
                        {t('selectDeliveryMethod')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddressStep;