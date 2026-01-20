
import { useState, useEffect } from 'react';
import './ImageGallery.css';

interface Photo {
    id: string;
    url: string;
    isPrimary?: boolean;
}

interface ImageGalleryProps {
    photos: Photo[];
    altText: string;
}

export default function ImageGallery({ photos, altText }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset index when photos change
    useEffect(() => {
        // Find primary photo index if exists, otherwise 0
        const primaryIndex = photos.findIndex(p => p.isPrimary);
        setCurrentIndex(primaryIndex >= 0 ? primaryIndex : 0);
    }, [photos]);

    const hasPhotos = photos && photos.length > 0;
    const currentPhoto = hasPhotos ? photos[currentIndex] : null;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasPhotos) return;
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasPhotos) return;
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    if (!hasPhotos) {
        return (
            <div className="image-gallery">
                <div className="gallery-main">
                    <div className="gallery-placeholder">
                        🍽️
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="image-gallery">
            <div className="gallery-main">
                <img
                    src={currentPhoto!.url}
                    alt={`${altText} - View ${currentIndex + 1}`}
                    className="gallery-image"
                />

                {photos.length > 1 && (
                    <>
                        <button className="gallery-nav-btn nav-prev" onClick={handlePrev} aria-label="Previous image">
                            ‹
                        </button>
                        <button className="gallery-nav-btn nav-next" onClick={handleNext} aria-label="Next image">
                            ›
                        </button>
                    </>
                )}
            </div>

            {photos.length > 1 && (
                <div className="gallery-thumbnails">
                    {photos.map((photo, index) => (
                        <div
                            key={photo.id || index}
                            className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <img src={photo.url} alt={`Thumbnail ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
