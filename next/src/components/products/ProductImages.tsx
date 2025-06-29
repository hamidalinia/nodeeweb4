import { useState } from 'react';
import TheImage from '@/components/blocks/TheImage';
import { useTranslation } from 'next-i18next';

type Props = {
    thumbnail?: string;
    photos?: string[];
    productName: string;
};

export default function ProductImages({ thumbnail, photos, productName }: Props) {
    const { t } = useTranslation();
    const [mainImage, setMainImage] = useState(thumbnail || '/default.jpg');

    return (
        <div className="sticky top-4 max-md:static">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                <TheImage
                    settings={{
                        style: { borderRadius: '0.5rem' },
                        content: {
                            classes: 'rounded-md object-cover',
                            src: mainImage,
                            alt: productName,
                        },
                    }}
                />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setMainImage(thumbnail || '/default.jpg')}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === thumbnail ? 'border-blue-500' : 'border-transparent'}`}
                    aria-label={t('product:setMainImage')}
                >
                    <TheImage
                        settings={{
                            content: {
                                classes: 'object-cover w-full h-full',
                                src: thumbnail || '/default.jpg',
                                alt: productName,
                            },
                        }}
                    />
                </button>

                {photos?.map((photo, i) => (
                    <button
                        key={i}
                        onClick={() => setMainImage(photo)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === photo ? 'border-blue-500' : 'border-transparent'}`}
                        aria-label={`${t('product:viewImage')} ${i + 1}`}
                    >
                        <TheImage
                            settings={{
                                content: {
                                    classes: 'object-cover w-full h-full',
                                    src: photo || '/default.jpg',
                                    alt: productName,
                                },
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}