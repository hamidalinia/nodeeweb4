import { useRouter } from 'next/router';

export default function Product() {
    const router = useRouter();
    const { slug } = router.query;

    return (
        <div>
            <h1>Post: {slug}</h1>
            {/* You can fetch data based on `slug` here */}
        </div>
    );
}
