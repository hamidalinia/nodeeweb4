import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export default function ReviewsSection() {
    const { t } = useTranslation();

    const [reviews, setReviews] = useState([
        {
            id: 1,
            product: 'Wireless Bluetooth Headphones',
            rating: 5,
            comment: 'Excellent sound quality and comfortable to wear for long periods. Battery life is impressive!',
            date: '2025-06-10',
            images: ['/product1.jpg']
        },
        {
            id: 2,
            product: 'Smart Watch Series 5',
            rating: 4,
            comment: 'Good features but battery could last longer. The health tracking is accurate though.',
            date: '2025-05-28',
            images: []
        },
        {
            id: 3,
            product: 'USB-C Fast Charger',
            rating: 3,
            comment: 'Charges fast but gets quite hot during use. Works as advertised but concerned about longevity.',
            date: '2025-05-15',
            images: ['/charger1.jpg', '/charger2.jpg']
        }
    ]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedReview, setEditedReview] = useState({ rating: 0, comment: '' });

    const handleEdit = (id: number) => {
        const review = reviews.find(r => r.id === id);
        if (review) {
            setEditedReview({ rating: review.rating, comment: review.comment });
            setEditingId(id);
        }
    };

    const handleSave = () => {
        if (editingId) {
            setReviews(reviews.map(review =>
                review.id === editingId
                    ? { ...review, ...editedReview }
                    : review
            ));
            setEditingId(null);
        }
    };

    const handleDelete = (id: number) => {
        setReviews(reviews.filter(review => review.id !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">{t('reviews')}</h2>

            <div className="space-y-8">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">{review.product}</h3>
                            <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>

                        {editingId === review.id ? (
                            <div className="mt-4">
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setEditedReview({...editedReview, rating: star})}
                                            className="text-2xl mr-1"
                                        >
                                            {star <= editedReview.rating ? '★' : '☆'}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={editedReview.comment}
                                    onChange={(e) => setEditedReview({...editedReview, comment: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                                />
                                <div className="flex space-x-3 mt-3">
                                    <button
                                        onClick={handleSave}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
                                    >
                                        {t('save')}
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm"
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex mt-2 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">
                      {i < review.rating ? '★' : '☆'}
                    </span>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4">{review.comment}</p>

                                {review.images.length > 0 && (
                                    <div className="flex space-x-3 mb-4">
                                        {review.images.map((img, idx) => (
                                            <div key={idx} className="w-20 h-20 border rounded-md overflow-hidden">
                                                <img
                                                    src={img}
                                                    alt={`Review ${review.id} image ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleEdit(review.id)}
                                        className="text-indigo-600 text-sm"
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="text-red-600 text-sm"
                                    >
                                        {t('delete')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}