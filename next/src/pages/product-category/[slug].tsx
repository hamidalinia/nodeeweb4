import { useRouter } from 'next/router';

export default function ProductCategoryPage() {
    const router = useRouter();
    const { slug } = router.query;

    return (
        <div>
            <h1>Product Category: {slug}</h1>
            {/* You can fetch data based on `slug` here */}
        </div>
    );
}
