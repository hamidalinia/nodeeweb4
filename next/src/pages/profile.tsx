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

    return (
        <div className="max-w-md mx-auto my-8">

        </div>
    );
}