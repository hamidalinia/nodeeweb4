// export default function LoginForm() {
//     return 'login'
// }

 // Required for client-side interactivity in Next.js 13+

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { toast } from 'sonner';
import  PhoneForm  from '@/components/login/AuthenticationForm';
import  ActivationForm  from '@/components/login/ActivationForm';
 import PasswordForm from "@/components/login/PasswordForm";
 import RegistrationForm from "@/components/login/RegistrationForm";

// import { CircularProgress } from '@mui/material';


export default function LoginForm({ fromPage }:{fromPage:string}) {
    const router = useRouter();
    const { t } = useTranslation();

    // State management
    const [formState, setFormState] = useState<{
        captcha: boolean;
        phoneNumber: string,
        thePhoneNumber: string,
        activationCode: string,
        enterActivationCodeMode: boolean,
        showSecondForm: boolean,
        userWasInDbBefore: boolean,
        isDisplay: boolean,
        setPassword: boolean,
        countryCode: string, // Default country code
        getPassword: boolean,
        firstName: string,
        lastName: string,
        passwordAuthentication: boolean,
        registerExtraFields: [],
        extraFields: any,
        internationalCode: string,
        email: string,
        goToProfile: boolean,
        loginMethod: string,
        token: string,
        CameFromPost: boolean,
        goToProduct: string,
        goToCheckout: boolean,
        goToChat: boolean,
        timer: number,
        password: ''}>({
        captcha: false,
        phoneNumber: '',
        thePhoneNumber: '',
        activationCode: '',
        enterActivationCodeMode: false,
        showSecondForm: false,
        userWasInDbBefore: true,
        isDisplay: true,
        setPassword: false,
        countryCode: '98', // Default country code
        getPassword: false,
        firstName: '',
        lastName: '',
        passwordAuthentication: true,
        registerExtraFields: [],
        extraFields: {},
        internationalCode: '',
        email: '',
        goToProfile: false,
        loginMethod: 'sms',
        token: '',
        CameFromPost: false,
        goToProduct: '',
        goToCheckout: false,
        goToChat: false,
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);





    // Helper functions
    const updateFormState = (updates: any) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };


    // Activation code handler




    // Navigation effects
    useEffect(() => {
        if (!formState.token) return;

        if (formState.token && formState.goToProduct) {
            router.push(`/submit-order/${formState.goToProduct}`);
            return;
        }

        if (formState.token && formState.goToCheckout &&
            formState.firstName && formState.lastName && !formState.setPassword) {
            router.push('/checkout');
            return;
        }

        if (formState.token && !formState.goToCheckout && fromPage && !formState.setPassword) {
            router.push(`${fromPage}/`);
            return;
        }

        if (formState.token && formState.goToChat) {
            router.push('/chat');
            return;
        }

        if (formState.token && formState.CameFromPost && !formState.setPassword) {
            router.push('/add-new-post/publish');
            return;
        }

        if ((formState.token && !formState.CameFromPost && !formState.setPassword &&
            formState.firstName && formState.lastName) || formState.goToProfile) {
            router.push('/profile');
        }
    }, [formState, router, fromPage]);

 // Continue to Part 4...
    // Continue from Part 3...

    // Main render function
    console.log("formState",formState)
    return (
        <div className="max-w-md mx-auto my-8">
            {formState.isDisplay && (
                <PhoneForm
                    formState={formState}
                    updateFormState={updateFormState}
                />
            )}

            {formState.enterActivationCodeMode && (
                <ActivationForm
                    formState={formState}
                    updateFormState={updateFormState}
                    // handleActivation={handleActivation}
                    // handleWrongPhoneNumber={handleWrongPhoneNumber}
                    // handleRegister={handleRegister}
                    // globalTimerSet={globalTimerSet}
                    // t={t}
                />
            )}

            {formState.setPassword && (
                <RegistrationForm
                    formState={formState}
                    updateFormState={updateFormState}
                />
            )}

            {formState.getPassword && (
                <PasswordForm
                    formState={formState}
                    updateFormState={updateFormState}
                />
            )}
        </div>
    );
}