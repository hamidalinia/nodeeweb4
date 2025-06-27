import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { updateAddress } from '@/functions';
import { ThemeData } from '@/types/themeData';

interface UserAddress {
    id?: string;
    fullName: string;
    phone: string;
    country: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
    saveAddress?: boolean;
}

interface ProvinceOption {
    id: string;
    name: string;
}

const DeliveryForm = ({
                          theme,
                          onSubmit,
                          lang,
                          showCancel,
                          onCancel,
                          initialAddress
                      }: {
    theme: ThemeData;
    onSubmit: (data: UserAddress) => void;
    lang: 'fa' | 'en';
    showCancel?: boolean;
    onCancel?: () => void;
    initialAddress?: UserAddress;
}) => {
    const { t } = useTranslation('common');
    const themeMode=theme?.mode;

    const [formData, setFormData] = useState<UserAddress>(initialAddress || {
        fullName: '',
        phone: '',
        country: 'iran',
        province: '',
        city: '',
        address: '',
        postalCode: '',
        saveAddress: true,
    });

    const provinceOptions: ProvinceOption[] = [
        { id: 'tehran', name: t('provinces.tehran') },
        { id: 'esfahan', name: t('provinces.esfahan') },
        { id: 'khorasan', name: t('provinces.khorasan') },
        { id: 'fars', name: t('provinces.fars') },
        { id: 'azarbaijan', name: t('provinces.azarbaijan') },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // RTL support for Persian
    const isRTL = lang === 'fa';
    const directionClass = isRTL ? 'rtl' : 'ltr';
    const textAlignClass = isRTL ? 'text-right' : 'text-left';

    return (
        <div className={`${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} ${directionClass}`}>
            <h2 className={`text-xl font-semibold mb-4 ${textAlignClass}`}>
                {initialAddress ? t('editAddress') : t('newAddress')}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                        <label htmlFor="fullName" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('fullName')}
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder={t('fullNamePlaceholder')}
                            required
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('phoneNumber')}
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t('phonePlaceholder')}
                            required
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir="ltr"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label htmlFor="country" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('country')}
                        </label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <option value="iran">{t('iran')}</option>
                            <option value="usa">{t('usa')}</option>
                            <option value="uae">{t('uae')}</option>
                        </select>
                    </div>

                    {/* Province */}
                    <div>
                        <label htmlFor="province" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('province')}
                        </label>
                        <select
                            id="province"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            required
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <option value="">{t('selectProvince')}</option>
                            {provinceOptions.map(province => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City */}
                    <div>
                        <label htmlFor="city" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('city')}
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder={t('cityPlaceholder')}
                            required
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        />
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label htmlFor="postalCode" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('postalCode')}
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder={t('postalCodePlaceholder')}
                            required
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir="ltr"
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label htmlFor="address" className={`block text-sm font-medium mb-1 ${textAlignClass}`}>
                            {t('fullAddress')}
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={t('addressPlaceholder')}
                            required
                            rows={3}
                            className={`w-full p-3 rounded border ${themeMode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        />
                    </div>

                    {/* Save Address */}
                    <div className="md:col-span-2 flex items-center">
                        <input
                            type="checkbox"
                            id="saveAddress"
                            name="saveAddress"
                            checked={formData.saveAddress}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="saveAddress" className={`ml-2 block text-sm ${textAlignClass}`}>
                            {t('saveAddress')}
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    onClick={(e)=>updateAddress({address:formData})}
                    className={`mt-6 px-6 py-3 rounded font-medium ${
                        themeMode === 'dark'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-purple-500 hover:bg-purple-600'
                        } text-white transition-colors duration-200 w-full`}
                >
                    {initialAddress ? t('updateAddress') : t('saveAddressButton')}
                </button>
            </form>
        </div>
    );
};

export default DeliveryForm;