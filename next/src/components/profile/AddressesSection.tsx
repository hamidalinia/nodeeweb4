import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export default function AddressesSection() {
    const { t } = useTranslation();
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'John Doe',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States',
            phone: '+1 (555) 123-4567',
            isDefault: true
        },
        {
            id: 2,
            name: 'John Doe',
            street: '456 Park Avenue',
            city: 'Brooklyn',
            state: 'NY',
            zip: '11201',
            country: 'United States',
            phone: '+1 (555) 987-6543',
            isDefault: false
        }
    ]);

    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        isDefault: false
    });

    const handleEdit = (id: number) => {
        const address = addresses.find(addr => addr.id === id);
        if (address) {
            setNewAddress({ ...address });
            setIsEditing(id);
        }
    };

    const handleSave = () => {
        if (isEditing) {
            // Update existing address
            setAddresses(addresses.map(addr =>
                addr.id === isEditing ? { ...newAddress, id: isEditing } as any : addr
            ));
        } else {
            // Add new address
            setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
        }
        setIsEditing(null);
        setNewAddress({
            name: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: '',
            isDefault: false
        });
    };

    const handleDelete = (id: number) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleSetDefault = (id: number) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('addresses')}</h2>
                <button
                    onClick={() => setIsEditing(0)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <span className="mr-1">+</span> {t('addAddress')}
                </button>
            </div>

            {isEditing !== null && (
                <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium mb-4">
                        {isEditing ? t('editAddress') : t('addNewAddress')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('fullName')}
                            </label>
                            <input
                                type="text"
                                value={newAddress.name}
                                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('namePlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('phone')}
                            </label>
                            <input
                                type="tel"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('phonePlaceholder')}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('streetAddress')}
                            </label>
                            <input
                                type="text"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('streetPlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('city')}
                            </label>
                            <input
                                type="text"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('state')}
                            </label>
                            <input
                                type="text"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('zipCode')}
                            </label>
                            <input
                                type="text"
                                value={newAddress.zip}
                                onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('country')}
                            </label>
                            <input
                                type="text"
                                value={newAddress.country}
                                onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={newAddress.isDefault}
                                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                className="h-4 w-4 text-indigo-600 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                {t('setAsDefault')}
                            </label>
                        </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            {t('saveAddress')}
                        </button>
                        <button
                            onClick={() => setIsEditing(null)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow relative">
                        {address.isDefault && (
                            <span className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {t('default')}
              </span>
                        )}
                        <h3 className="font-medium text-lg mb-2">{address.name}</h3>
                        <p className="text-gray-600">
                            {address.street}<br />
                            {address.city}, {address.state} {address.zip}<br />
                            {address.country}
                        </p>
                        <p className="mt-2 text-gray-600">{address.phone}</p>

                        <div className="flex space-x-3 mt-4 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => handleEdit(address.id)}
                                className="text-indigo-600 text-sm"
                            >
                                {t('edit')}
                            </button>
                            <button
                                onClick={() => handleDelete(address.id)}
                                className="text-red-600 text-sm"
                            >
                                {t('delete')}
                            </button>
                            {!address.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(address.id)}
                                    className="text-gray-600 text-sm"
                                >
                                    {t('setDefault')}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}