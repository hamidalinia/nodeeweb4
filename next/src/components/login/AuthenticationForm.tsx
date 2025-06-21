import React from 'react';
import {toast} from "sonner";
import { useTranslation } from 'next-i18next';
import {register} from '@/functions';
// import {globalTimerSet} from '@/constants/config';


interface PhoneFormProps {
    formState: {
        countryCode: string;
        thePhoneNumber: string;
        phoneNumber?: string;
        loginMethod?: string;
        isDisplay?: boolean;
        enterActivationCodeMode?: boolean;
        userWasInDbBefore?: boolean;
        getPassword?: boolean;
        timer?: number;
    };
    updateFormState: (update: Partial<PhoneFormProps['formState']>) => void;
}

const PhoneForm: React.FC<PhoneFormProps> = ({ formState, updateFormState }) => {
    const { t } = useTranslation('common');

    const handleRegister = async (e: any) => {
        e.preventDefault();

        const { countryCode, phoneNumber, loginMethod } = formState;

        if (!phoneNumber) {
            toast.error(t('Please enter your phone number'));
            return;
        }

        try {
            const number = phoneNumber?.substring(phoneNumber.length - 10);
            const phoneNumberFull = countryCode + number;

            // Replace with your actual API call
            console.log("loginMethod",loginMethod)
            const r = await register(phoneNumberFull, countryCode, loginMethod ? loginMethod : "sms");

            if (r?.success === false && r.message) {
                toast.error(t(r.message));
                return;
            }
console.log("updateFormState",updateFormState,r)
            updateFormState({
                thePhoneNumber: number,
                phoneNumber: number,
                enterActivationCodeMode: r?.shallWeSetPass,
                isDisplay: false,
                userWasInDbBefore: r?.userWasInDbBefore,
                getPassword: !r?.shallWeSetPass && r?.userWasInDbBefore,
                // timer: 60
                // timer: globalTimerSet
            });

        } catch (error) {
            toast.error(t('Registration failed'));
            console.error(error);
        }
    };

    const handleSendCodeAgain = (e?: React.MouseEvent) => {
        e?.preventDefault();
        console.log('==> handleSendCodeAgain()');
        handleRegister(e as unknown as React.FormEvent); // You could refactor this if it's really the same
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleRegister}>
                <div className="flex" dir="ltr">
                    <select
                        className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateFormState({ countryCode: e.target.value })}
                        value={formState.countryCode}
                    >
                        <option value="98">+98</option>
                    </select>
                    <input
                        type="tel"
                        id="phoneNumber"
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('phone number')}
                        value={formState.phoneNumber || ''}
                        onChange={(e) => updateFormState({ phoneNumber: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    onClick={handleRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('get enter code')}
                </button>
            </form>

            {formState.timer === 0 && (
                <button
                    onClick={handleSendCodeAgain}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Send code again?')}
                </button>
            )}
        </div>
    );
};

export default PhoneForm;
