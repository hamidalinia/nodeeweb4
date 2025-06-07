import React, { useState, useEffect,ReactElement,isValidElement } from 'react';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/products/ProductCard';
import PostCard from '@/components/posts/PostCard';
import { fetchEntity } from '@/functions/index';
import TheImage from './TheImage';

// Dynamically import Splide for client-side only
// const Splide = dynamic(() => import('@splidejs/react-splide').then(mod => mod.Splide), { ssr: false });
// const SplideSlide = dynamic(() => import('@splidejs/react-splide').then(mod => mod.SplideSlide), { ssr: false });
import { Splide, SplideSlide } from '@splidejs/react-splide';
type SliderProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: {
                classes?: string;
                include?: string;
                arrows?: boolean;
                perPage?: string;
                entity?: string;
                customQuery?: string;
        };
    };
    products?: any[]; // ADD THIS
    posts?: any[]; // ADD THIS
};

export default function CustomSlider({ settings,products: externalProducts,posts: externalPosts,  children }: React.PropsWithChildren<SliderProps>) {
    const style = settings?.style || {};
    const contentFields = settings?.content || {};
    const classes = settings?.content?.classes || '';

    const entity = contentFields.entity || null;
    const perPage = parseInt(contentFields.perPage || '12');
    const customQuery = contentFields.customQuery;
    // const showArrows = contentFields.arrows !== false;
let showArrows=true
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const getBlocks = () => {
        // 1. Check if children is a valid React element
        if (!children || !React.isValidElement(children)) return [];

        // 2. Check if children has props and blocks property
        const childProps = children.props as { blocks?: any[] };
        if (!childProps || !childProps.blocks) return [];

        // 3. Verify blocks is an array
        return Array.isArray(childProps.blocks) ? childProps.blocks : [];
    };
    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    useEffect(() => {
        if(entity) {
            setLoading(true);
            console.log("customQuery",customQuery)
            fetchEntity(entity, 0, 10, customQuery)
                .then(data => {
                    setItems(data || []);
                    setError(null);
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [entity, perPage, customQuery]);

    if (loading) return <div style={{ padding: 20 }}>در حال بارگذاری {entity}...</div>;
    if (error) return <div style={{ padding: 20, color: 'red' }}>خطا در بارگذاری: {error}</div>;

    if (entity === 'product') {
        // SSR fallback - simple grid
        if (!isClient) {
            return (
                <div className={`slider ${classes}`} style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(perPage, 5)}, 1fr)`,
                    gap: '10px',
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
            <div  className={`slider ${classes}`} style={{ ...style }}>
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
                                perPage: Math.min(4, perPage),
                            },
                            768: {
                                perPage: Math.min(3, perPage),
                            },
                            480: {
                                perPage: 2,
                            }
                        }
                    }}
                >
                    {items.map(p => (
                        <SplideSlide key={p._id}>
                            <ProductCard product={p} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        );
    }
    if (entity === 'post') {
        // SSR fallback - simple grid
        if (!isClient) {
            return (
                <div className={`slider ${classes}`} style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(perPage, 5)}, 1fr)`,
                    gap: '10px',
                    overflowX: 'auto',
                    ...style
                }}>
                    {externalPosts?.map(p => (
                            <PostCard key={p._id} post={p} />
                    ))}
                </div>
            );
        }

        return (
            <div className={`slider ${classes}`} style={{ ...style }}>
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
                                perPage: Math.min(4, perPage),
                            },
                            768: {
                                perPage: Math.min(3, perPage),
                            },
                            480: {
                                perPage: 2,
                            }
                        }
                    }}
                >
                    {items.map(p => (
                        <SplideSlide key={p._id}>
                            <PostCard post={p} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        );
    }
    const blocks = getBlocks();
// console.log("JSON.stringify(children)",(children))
    return (
        <div
            className={`slider ${classes}`}
            style={{
                ...style,
            }}
        >
            <Splide
                options={{
                    type: 'slide',
                    perPage: 1,
                    perMove: 1,
                    gap: '10px',
                    arrows: showArrows,
                    pagination: false,
                    breakpoints: {
                        1024: {
                            perPage: 1, // or just 1 if you want to fix it
                        },
                        768: {
                            perPage: 1,
                        },
                        480: {
                            perPage: 1,
                        },
                    },
                }}
            >
                {/*{children?.props?.blocks?.length>0 && children?.props?.blocks.map((block, index) =>*/}
                    {/*block.type === 'image' ? (*/}
                        {/*<SplideSlide key={index}>*/}
                             {/*<TheImage settings={block?.settings} />*/}
                        {/*</SplideSlide>*/}
                    {/*) : null*/}
                {/*)}*/}
                {/*{isValidElement(children) && children.props?.blocks?.length > 0*/}
                    {/*? children.props.blocks.map((block: any, index: number) =>*/}
                        {/*block.type === 'image' ? (*/}
                            {/*<SplideSlide key={index}>*/}
                                {/*<TheImage settings={block?.settings} />*/}
                            {/*</SplideSlide>*/}
                        {/*) : null*/}
                    {/*)*/}
                    {/*: null}*/}
                {blocks.length > 0 && blocks.map((block, index) =>
                    block.type === 'image' ? (
                        <SplideSlide key={index}>
                            <TheImage settings={block?.settings} />
                        </SplideSlide>
                    ) : null
                )}
            </Splide>
        </div>
    );

}