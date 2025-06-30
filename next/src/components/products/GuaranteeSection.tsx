import { ShieldCheck, Undo2, Phone, Truck } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export default function GuaranteeSection() {
    const { t } = useTranslation('product');

    return (
        <div className="mb-7">
            <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                    <ShieldCheck className="w-5 h-5 text-green-500 ml-2" />
                    {t('guarantees.authenticity')}
                </li>
                <li className="flex items-center">
                    <Undo2 className="w-5 h-5 text-green-500 ml-2" />
                    {t('guarantees returnPolicy')}
                </li>
                <li className="flex items-center">
                    <Phone className="w-5 h-5 text-green-500 ml-2" />
                    {t('guarantees consultation')}
                </li>
                <li className="flex items-center">
                    <Truck className="w-5 h-5 text-green-500 ml-2" />
                    {t('guarantees freeShipping')}
                </li>
            </ul>
        </div>
    );
}