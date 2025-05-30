import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/products/ProductCard';
import { fetchEntity } from '@/functions/index';

// Dynamically import Splide for client-side only
// const Splide = dynamic(() => import('@splidejs/react-splide').then(mod => mod.Splide), { ssr: false });
// const SplideSlide = dynamic(() => import('@splidejs/react-splide').then(mod => mod.SplideSlide), { ssr: false });
import { Splide, SplideSlide } from '@splidejs/react-splide';
type SliderProps = {
    settings: {
        style?: { fields?: React.CSSProperties };
        content?: {
            fields?: {
                include?: string;
                arrows?: boolean;
                perPage?: string;
                entity?: string;
                customQuery?: string;
            };
        };
    };
    products?: any[]; // ADD THIS
};

export default function CustomSlider({ settings,products: externalProducts,  children }: React.PropsWithChildren<SliderProps>) {
    const style = settings?.style?.fields || {};
    const contentFields = settings?.content?.fields || {};

    const entity = contentFields.entity || 'product';
    const perPage = parseInt(contentFields.perPage || '12');
    const customQuery = contentFields.customQuery;
    // const showArrows = contentFields.arrows !== false;
let showArrows=true
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchEntity(entity, 0, perPage, customQuery)
            .then(data => {
                setItems(data || []);
                setError(null);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [entity, perPage, customQuery]);

    if (loading) return <div style={{ padding: 20 }}>در حال بارگذاری {entity}...</div>;
    if (error) return <div style={{ padding: 20, color: 'red' }}>خطا در بارگذاری: {error}</div>;

    if (entity === 'product') {
        // SSR fallback - simple grid
        if (!isClient) {
            return (
                <div className={'slider'} style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(perPage, 5)}, 1fr)`,
                    gap: '10px',
                    padding: '10px 0',
                    overflowX: 'auto',
                    ...style
                }}>
                    {externalProducts?.map(p => (
                            <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            );
        }

        return (
            <div  className={'slider'} style={{ padding: '10px 0', ...style }}>
                <Splide
                    options={{
                        type: 'slide',
                        perPage: perPage,
                        perMove: 1,
                        gap: '10px',
                        arrows: showArrows,
                        // direction: 'rtl',
                        pagination: false,
                        breakpoints: {
                            1024: {
                                perPage: Math.min(3, perPage),
                            },
                            768: {
                                perPage: Math.min(2, perPage),
                            },
                            480: {
                                perPage: 1,
                            }
                        }
                    }}
                >
                    {items.map(p => (
                        <SplideSlide key={p.id}>
                            <ProductCard product={p} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        );
    }

    return (
        <div
            className={'slider'}
            style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '10px',
                padding: '10px 0',
                ...style,
            }}
        >
            {children}
        </div>
    );
}