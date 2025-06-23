import React from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'sonner';
import { setPassWithPhoneNumber } from '@/functions';
import { checkCodeMeli, isPersianText } from '@/utils';
import { loginSuccess, logout } from '@/store/slices/userSlice';
import {useAppDispatch} from '@/store/hooks';

interface ExtraField {
    name: string;
    label: string;
    require?: boolean;
}

interface FormState {
    firstName: string;
    lastName: string;
    countryCode: string;
    firstNameError?: string;
    lastNameError?: string;
    phoneNumber: string;
    password?: string;
    email?: string;
    internationalCode?: string;
    internationalCodeClass?: string;
    sessionId?: string;
    address?: any[];
    webSite?: { title?: string };
    userWasInDbBefore?: boolean;
    passwordAuthentication?: boolean;
    extraFields?: Record<string, string>;
    registerExtraFields?: ExtraField[];
    language?: string;
    setPassword?: boolean;
    goToProfile?: boolean;
    goToSiteBuilder?: boolean;
}

interface RegistrationFormProps {
    formState: FormState;
    updateFormState: (update: Partial<FormState>) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
                                                               formState,
                                                               updateFormState = () => {},
                                                           }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        // Implement logout logic here
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const validateForm = (): boolean => {
        const { firstName, lastName, password, extraFields = {}, registerExtraFields = [] } = formState;

        // Validate required fields
        if (!firstName) {
            toast.error(t('First name is required'));
            return false;
        }

        if (!lastName) {
            toast.error(t('Last name is required'));
            return false;
        }

        if (formState.passwordAuthentication && !password) {
            toast.error(t('Password is required'));
            return false;
        }

        // Validate Persian text if language is Farsi
        if (formState.language === 'fa') {
            if (!isPersianText(firstName)) {
                toast.error(t('Enter first name in Persian'));
                return false;
            }
            if (!isPersianText(lastName)) {
                toast.error(t('Enter last name in Persian'));
                return false;
            }
        }

        // Validate extra fields
        for (const field of registerExtraFields) {
            if (field.require && !extraFields[field.name]) {
                toast.error(t(`${field.label} is required`));
                return false;
            }

            // Special validation for international code
            if (field.name === 'internationalCode' && field.require) {
                if (!checkCodeMeli(extraFields[field.name])) {
                    toast.error(t('Invalid national code'));
                    return false;
                }
            }
        }

        return true;
    };

    const prepareAddressData = (): any[] => {
        const { address = [], extraFields = {} } = formState;
        const newAddress = [...address];

        if (extraFields.address) {
            const addressEntry: any = { StreetAddress: extraFields.address };

            // Check for postal code in various possible field names
            ['PostalCode', 'postalCode', 'postalcode'].forEach(key => {
                if (extraFields[key]) {
                    addressEntry.PostalCode = extraFields[key];
                }
            });

            newAddress.push(addressEntry);
        }

        return newAddress;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        scrollToTop();

        if (!validateForm()) return;

        const {
            countryCode = '98',
            phoneNumber,
            firstName,
            lastName,
            email,
            webSite,
            password,
            userWasInDbBefore,
            internationalCode,
            extraFields = {},
        } = formState;

        const addressData = prepareAddressData();

        try {
            const response = await setPassWithPhoneNumber({
                phoneNumber: countryCode + phoneNumber,
                firstName,
                lastName,
                address: addressData,
                email,
                data: extraFields,
                internationalCode,
                password,
                ...(webSite?.title && !userWasInDbBefore ? { webSite } : {}),
            });

            if (response.success) {
                dispatch(loginSuccess({
                    token: response.customer.token,
                    address: response.customer.address,
                    firstName: response.customer.firstName,
                    lastName: response.customer.lastName,
                    phoneNumber: countryCode +phoneNumber
                }));
                updateFormState({
                    setPassword: false,
                    goToProfile: true,
                });

                if (response.domainIsExist) {
                    toast.error(t('Website already exists'));
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(t('Registration failed'));
        }
    };

    const {
        firstName,
        lastName,
        extraFields = {},
        registerExtraFields = [],
        passwordAuthentication,
    } = formState;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Your first name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rtl"
                            placeholder={t('First name (persian)')}
                            value={firstName}
                            onChange={(e) => updateFormState({ firstName: e.target.value })}
                            dir="rtl"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Your last name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rtl"
                            placeholder={t('Last name (persian)')}
                            value={lastName}
                            onChange={(e) => updateFormState({ lastName: e.target.value })}
                            dir="rtl"
                            required
                        />
                    </div>

                    {registerExtraFields.map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label} {field.require && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type={field.name === 'password' ? 'password' : 'text'}
                                id={field.name}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    field.name === 'internationalCode' ? 'ltr' : 'rtl'
                                    }`}
                                placeholder={field.label}
                                value={extraFields[field.name] || ''}
                                onChange={(e) => {
                                    updateFormState({
                                        extraFields: { ...extraFields, [field.name]: e.target.value },
                                    });
                                }}
                                dir={field.name === 'internationalCode' ? 'ltr' : 'rtl'}
                                required={field.require}
                            />
                        </div>
                    ))}

                    {passwordAuthentication && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Password')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                                placeholder="******"
                                value={formState.password || ''}
                                onChange={(e) => updateFormState({ password: e.target.value })}
                                dir="ltr"
                                required
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        {t('Register')}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        {t('Logout')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;