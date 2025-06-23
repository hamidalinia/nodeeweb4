import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useTranslation } from 'next-i18next';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess, logout } from '@/store/slices/userSlice';
import { authCustomerWithPassword, authCustomerForgotPass } from '@/functions';

interface PasswordFormProps {
    formState: {
        activationCode: string;
        countryCode: string;
        thePhoneNumber: string;
        phoneNumber: string;
        token: string;
        firstName: string;
        lastName: string;
        goToCheckout: boolean;
        showSecondForm: boolean;
        setPassword: boolean;
        getPassword: boolean;
        isDisplay: boolean;
        enterActivationCodeMode: boolean;
        goToProfile: boolean;
        password?: string;
        loginMethod?: string;
    };
    updateFormState: (update: Partial<PasswordFormProps['formState']>) => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
                                                       formState,
                                                       updateFormState,
                                                   }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handlePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const { countryCode, phoneNumber, password, goToCheckout } = formState;

        try {
            const result = await authCustomerWithPassword(
                countryCode + phoneNumber,
                password || ''
            );

            if ('error' in result) {
                if (result.requiresToast) {
                    toast.error(t(result.message));
                }
                if (result.status === 401) {
                    dispatch(logout());
                }
                return;
            }

            // Successful login
            dispatch(loginSuccess({
                token: result.customer.token,
                firstName: result.customer.firstName,
                lastName: result.customer.lastName,
                phoneNumber: phoneNumber
            }));

            updateFormState({
                token: result.token,
                firstName: result.customer.firstName,
                lastName: result.customer.lastName,
                goToProfile: !goToCheckout
            });

            toast.success(t('login_success'));
            router.push(goToCheckout ? '/checkout' : '/profile');

        } catch (error) {
            console.error("Login error:", error);
            toast.error(t('login_failed'));
        }
    };

    const handleForgotPass = async (e: React.FormEvent) => {
        e.preventDefault();
        const { countryCode, phoneNumber, loginMethod = 'sms' } = formState;

        try {
            const response = await authCustomerForgotPass(
                countryCode + phoneNumber,
                countryCode,
                loginMethod
            );

            updateFormState({
                enterActivationCodeMode: true,
                isDisplay: false,
                getPassword: false,
                firstName: response.firstName || formState.firstName,
                lastName: response.lastName || formState.lastName
            });

        } catch (error) {
            toast.error(t('password_reset_failed'));
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
            <form onSubmit={handlePassword}>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">{t('your phone number')}:</span>
                        <span className="text-sm font-medium ltr">
              +{formState.countryCode}
                            {formState.thePhoneNumber}
            </span>
                    </div>

                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {t('Enter password')}
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                        placeholder="******"
                        value={formState.password || ''}
                        onChange={(e) => updateFormState({ password: e.target.value })}
                        dir="ltr"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Login')}
                </button>

                <button
                    type="button"
                    onClick={handleForgotPass}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Forgot Password')}
                </button>

                <button
                    type="button"
                    onClick={handleWrongPhoneNumber}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Wrong phone number?')}
                </button>
            </form>
        </div>
    );
};

export default PasswordForm;