import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import { NormalizePrice, PriceFormat } from '@/utils';
import type { PostType } from '@/types/post';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { formatPrice } from '@/utils';
import { getBaseUrl } from '@/constants/config';
import { useTranslation } from 'next-i18next'

type Props = {
    post: PostType;
};

const PostCard = ({ post }: Props) => {
    let BaseConfig=getBaseUrl();
    const { t,ready } = useTranslation('common');
    BaseConfig='https://asakala.shop'
    const theme = useSelector((state: RootState) => state.theme);
    const [imgSrc, setImgSrc] = useState(post?.thumbnail
        ? post?.thumbnail?.startsWith('/')
            ? BaseConfig+post.thumbnail
            : `${BaseConfig}/${post.thumbnail}`
        : '/default.jpg');
    const title = post?.title?.fa || '';
    return (
        <div className="post-card rounded-lg border p-3 shadow-sm hover:shadow-md transition cursor-pointer bg-white dark:bg-gray-900 dark:text-white">
            <Link href={`/post/${post?.slug}`} passHref>
                <div className="relative aspect-square">
                    <img
                        src={imgSrc}
                        alt={title}
                        // fill
                        className="rounded-md object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImgSrc('/default.jpg')}
                    />
                </div>
                <h3 className="mt-2 text-md font-medium line-clamp-3">{title}</h3>
            </Link>


            <div className="w-full mt-2 flex items-center justify-center">

            </div>
        </div>
    );
};

export default PostCard;