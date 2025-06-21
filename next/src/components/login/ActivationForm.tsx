import React, {useState,useEffect} from 'react';
import { useTranslation } from 'next-i18next';
import {toast} from "sonner";
import { setToken } from '@/store/slices/userSlice';
import {useAppDispatch} from '@/store/hooks';

import {globalTimerSet} from '@/constants/config';
import {authenticateCustomerWithOTP,register} from '@/functions';

interface ActivationFormProps {
    formState: {
        countryCode: string;
        thePhoneNumber: string;
        phoneNumber:string;
        loginMethod:string;
        firstName:string;
        lastName:string;
        activationCode?: string;
        isDisplay?: boolean;
        showSecondForm?: boolean;
        userWasInDbBefore?: boolean;
        enterActivationCodeMode?: boolean;
        getPassword?: boolean;
        setPassword?: boolean;
        goToProfile?: boolean;
        token?: string;
        timer: number;
    };
    updateFormState: (state: Partial<{
        countryCode: string;
        phoneNumber:string;
        firstName:string;
        lastName:string;
        loginMethod:string;
        thePhoneNumber: string;
        userWasInDbBefore?: boolean;
        isDisplay?: boolean;
        showSecondForm?: boolean;
        activationCode?: string;
        enterActivationCodeMode?: boolean;
        getPassword?: boolean;
        setPassword?: boolean;
        goToProfile?: boolean;
        token?: string;
        timer: number;
    }>) => void;
}

const ActivationForm: React.FC<ActivationFormProps> = ({
                                                           formState,
                                                           updateFormState
                                                       }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [theFormState, setFormState] = useState<{
        timer: number }>({
        timer: globalTimerSet,
    });
    // Timer effect
    useEffect(() => {
        let interval: any;
    // || formState.getPassword
        if (formState.enterActivationCodeMode) {
            interval = setInterval(() => {
                setFormState(prev => ({

                    timer: prev.timer > 0 ? prev.timer - 1 : handleClearInterval()
                }));
            }, 1000);
        }
        return () => clearInterval(interval);
    // , formState.getPassword
    }, [formState.enterActivationCodeMode]);


    const handleRegister = async (e: any) => {
        e.preventDefault();

        const { countryCode, phoneNumber, loginMethod }:{ countryCode:string, phoneNumber:string, loginMethod:string } = formState;

        if (!phoneNumber) {
            toast.error(t('Please enter your phone number'));
            return;
        }

        try {
            const number = phoneNumber?.substring(phoneNumber.length - 10);
            const phoneNumberFull = countryCode + number;

            // Replace with your actual API call
            const r = await register(phoneNumberFull, countryCode, loginMethod);

            if (r?.success === false && r.message) {
                toast.error(t(r.message));
                return;
            }



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

    const handleClearInterval = () => {
        return 0;
    };

    const handleActivation = async (e: React.FormEvent) => {
        e.preventDefault();
        const { activationCode, countryCode, phoneNumber } = formState;

        if (!activationCode) {
            toast.error(t('Please enter activation code'));
            return;
        }

        try {


            // Replace with your actual API call
            const res = await authenticateCustomerWithOTP(countryCode + phoneNumber,
                activationCode);

            if (!res.success) {
                toast.error(t(res.message));
                return;
            }

            toast.success(t('Welcome'));
            dispatch(setToken(res.token));
            updateFormState({
                token: res.token,
                enterActivationCodeMode: false,
                setPassword: res.shallWeSetPass,
                firstName: res.firstName || formState.firstName,
                lastName: res.lastName || formState.lastName,
                userWasInDbBefore: res.userWasInDbBefore
            });

        } catch (error) {
            toast.error(t('Activation failed'));
            console.error(error);
        }
    };
    const handleWrongPhoneNumber = (e: React.FormEvent) => {
        e.preventDefault();
        updateFormState({
            phoneNumber: '',
            activationCode: '',
            enterActivationCodeMode: false,
            showSecondForm: false,
            isDisplay: true,
            setPassword: false,
            getPassword: false,
            goToProfile: false,
        });
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleActivation}>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">{t('your phone number')}:</span>
                        <span className="text-sm font-medium ltr">
                            +{formState.countryCode}{formState.thePhoneNumber}
                        </span>
                    </div>

                    {theFormState.timer > 0 && (
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            {/* Replace this with a real circular progress if needed */}
                            <div
                                className="text-red-500"
                                style={{
                                    borderWidth: '2px',
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    borderColor: 'red',
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                                {theFormState.timer}
                            </div>
                        </div>
                    )}

                    <label htmlFor="activationCode" className="block text-xs text-gray-500 mb-1">
                        {t('enter sent code')}
                    </label>
                    <input
                        type="number"
                        id="activationCode"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                        placeholder="______"
                        value={formState.activationCode || ''}
                        onChange={(e) => updateFormState({ activationCode: e.target.value })}
                        dir="ltr"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('login')}
                </button>

                <button
                    type="button"
                    onClick={handleWrongPhoneNumber}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Wrong phone number?')}
                </button>

                {theFormState.timer === 0 && (
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors border-0"
                    >
                        {t('Send code again?')}
                    </button>
                )}
            </form>
        </div>
    );
};

export default ActivationForm;
