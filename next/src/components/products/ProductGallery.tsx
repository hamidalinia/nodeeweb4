import TheImage from '@/components/blocks/TheImage';
import { useState } from 'react';

export const ProductGallery = ({
                                   thumbnail,
                                   photos = [],
                                   title
                               }: {
    thumbnail?: string;
    photos?: string[];
    title: string
}) => {
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
                            alt: title,
                        },
                    }}
                />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setMainImage(thumbnail || '/default.jpg')}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === thumbnail ? 'border-blue-500' : 'border-transparent'}`}
                >
                    <TheImage
                        settings={{
                            content: {
                                classes: 'object-cover w-full h-full',
                                src: thumbnail || '/default.jpg',
                                alt: title,
                            },
                        }}
                    />
                </button>

                {photos.map((photo, i) => (
                    <button
                        key={i}
                        onClick={() => setMainImage(photo)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === photo ? 'border-blue-500' : 'border-transparent'}`}
                    >
                        <TheImage
                            settings={{
                                content: {
                                    classes: 'object-cover w-full h-full',
                                    src: photo || '/default.jpg',
                                    alt: title,
                                },
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};