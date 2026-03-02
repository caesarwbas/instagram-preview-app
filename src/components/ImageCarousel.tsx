import React from 'react';
import { PLACEHOLDER_IMAGE, ASPECT_RATIOS } from '../utils/constants';
import type { AspectRatio, MediaItem } from '../types';
import VideoPlayer from './VideoPlayer';

interface ImageCarouselProps {
  images: string[];
  mediaItems: MediaItem[];
  aspectRatio: AspectRatio;
  currentSlide: number;
  onSlideChange: (slide: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, mediaItems, aspectRatio, currentSlide, onSlideChange }) => {
  const hasMedia = mediaItems.length > 0 || images.length > 0;
  const displayCount = hasMedia ? Math.max(mediaItems.length, images.length) : 1;
  const ratio = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['1:1'];
  const paddingBottom = `${(ratio.height / ratio.width) * 100}%`;

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide < displayCount - 1) {
      onSlideChange(currentSlide + 1);
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  };

  const renderSlide = (idx: number) => {
    const media = mediaItems[idx];
    if (media && media.type === 'video') {
      return (
        <VideoPlayer
          src={media.url}
          poster={media.thumbnail}
          className="carousel-video"
          overlay="feed"
        />
      );
    }
    const imgSrc = images[idx] || PLACEHOLDER_IMAGE;
    return <img src={imgSrc} alt={`Slide ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  };

  return (
    <div className="post-image-area" style={{ paddingBottom, position: 'relative' }}>
      <div
        className="carousel-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {Array.from({ length: displayCount }).map((_, idx) => (
          <div className="carousel-slide" key={idx} style={{ position: 'absolute', top: 0, left: `${idx * 100}%`, width: '100%', height: '100%' }}>
            {renderSlide(idx)}
          </div>
        ))}
      </div>

      {displayCount > 1 && (
        <>
          {currentSlide > 0 && (
            <button className="carousel-nav carousel-prev" onClick={goPrev}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          )}
          {currentSlide < displayCount - 1 && (
            <button className="carousel-nav carousel-next" onClick={goNext}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
          )}

          <div className="slide-counter">{currentSlide + 1}/{displayCount}</div>

          <div className="carousel-dots">
            {Array.from({ length: displayCount }).map((_, idx) => (
              <div
                key={idx}
                className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onSlideChange(idx); }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
