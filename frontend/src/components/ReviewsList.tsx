import React, { useEffect, useState } from 'react';
import './ReviewsList.css';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    userName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface ReviewsListProps {
    menuItemId: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ menuItemId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });

    useEffect(() => {
        loadReviews();
    }, [menuItemId, page]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const url = `${import.meta.env.VITE_API_URL}/api/public/menu/items/${menuItemId}/reviews?page=${page}&limit=10&sort=newest`;
            console.log('🔍 Fetching reviews from:', url);
            const response = await fetch(url);
            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('📦 Response data:', data);
            console.log('📝 Reviews count:', data.reviews?.length);

            setReviews(data.reviews || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setSummary(data.summary || { averageRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'star filled' : 'star'}>
                ⭐
            </span>
        ));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return date.toLocaleDateString();
    };

    if (loading && reviews.length === 0) {
        return <div className="reviews-loading">Loading reviews...</div>;
    }

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <h3>⭐ Reviews ({summary.averageRating.toFixed(1)} / 5.0)</h3>
                <p className="reviews-count">Based on {summary.totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            {summary.totalReviews > 0 && (
                <div className="rating-distribution">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = summary.distribution[star as keyof typeof summary.distribution] || 0;
                        const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

                        return (
                            <div key={star} className="rating-bar">
                                <span className="rating-label">{star}⭐</span>
                                <div className="bar-container">
                                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="rating-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <p>No reviews yet</p>
                        <p className="no-reviews-subtitle">Be the first to review this dish!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="review-user">
                                    <div className="user-avatar">{review.userName.charAt(0).toUpperCase()}</div>
                                    <div className="user-info">
                                        <span className="user-name">{review.userName}</span>
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="review-rating">{renderStars(review.rating)}</div>
                            </div>
                            {review.comment && (
                                <p className="review-comment">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="reviews-pagination">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
