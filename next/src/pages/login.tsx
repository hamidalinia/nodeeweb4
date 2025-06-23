'use client'; // Required for client-side interactivity in Next.js 13+

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import PhoneForm from '@/components/login/AuthenticationForm';
import ActivationForm from '@/components/login/ActivationForm';
import PasswordForm from "@/components/login/PasswordForm";
import RegistrationForm from "@/components/login/RegistrationForm";

export default function LoginForm({ fromPage }: { fromPage: string }) {
    const router = useRouter();
    const { t } = useTranslation();
    const token = useAppSelector((state) => state.user?.token);
    // State management
    const [formState, setFormState] = useState({
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
        timer: 0,
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    // Check for existing token on initial render
    useEffect(() => {
        if (token) {
            router.replace('/profile')
            // router.push('/profile',{replace:true});
        }
    }, [token, router]);

    // Helper functions
    const updateFormState = (updates: any) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

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
            // router.push('/profile',{replace:true});
            router.replace('/profile');
        }
    }, [formState, router, fromPage]);

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