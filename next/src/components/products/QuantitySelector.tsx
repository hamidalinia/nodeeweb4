import { useTranslation } from 'next-i18next';

type Props = {
    quantity: number;
    maxQuantity?: number;
    onIncrement: () => void;
    onDecrement: () => void;
    isMobile?: boolean;
};

export default function QuantitySelector({
                                             quantity,
                                             maxQuantity,
                                             onIncrement,
                                             onDecrement,
                                             isMobile = false
                                         }: Props) {
    const { t } = useTranslation('product');

    return (
        <div className={`${isMobile ? '' : 'mb-6 hidden md:block'}`}>
            {!isMobile && <h3 className="font-semibold mb-3">{t('quantity')}:</h3>}
            <div className={`flex items-center border rounded-md overflow-hidden ${isMobile ? 'w-24' : 'w-32'}`}>
                <button
                    onClick={onDecrement}
                    className={`${isMobile ? 'px-2 py-2' : 'px-3 py-2'} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600`}
                    aria-label={t('decreaseQuantity')}
                    disabled={quantity <= 1}
                >
                    -
                </button>
                <span className="flex-1 text-center text-sm">{quantity}</span>
                <button
                    onClick={onIncrement}
                    className={`${isMobile ? 'px-2 py-2' : 'px-3 py-2'} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600`}
                    aria-label={t('increaseQuantity')}
                    disabled={quantity >= (maxQuantity || Infinity)}
                >
                    +
                </button>
            </div>
        </div>
    );
}