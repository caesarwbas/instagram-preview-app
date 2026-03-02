import React, { useState, useEffect } from 'react';
import { PLACEHOLDER_IMAGE, DEFAULT_PROFILE_PIC } from '../utils/constants';
import StatusBar from './StatusBar';
import VideoPlayer from './VideoPlayer';
import type { DeviceType, ThemeMode, MediaItem } from '../types';

interface StoryPreviewProps {
  images: string[];
  mediaItems: MediaItem[];
  username: string;
  profilePic: string;
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  device?: DeviceType;
  theme?: ThemeMode;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
  images, mediaItems, username, profilePic, currentSlide, onSlideChange,
  device = 'ios', theme = 'light',
}) => {
  const displayImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const displayCount = Math.max(displayImages.length, mediaItems.length, 1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < displayCount - 1) {
            onSlideChange(currentSlide + 1);
          }
          return 0;
        }
        return prev + 0.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [currentSlide, displayCount, onSlideChange]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const halfWidth = rect.width / 2;
    if (x < halfWidth && currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    } else if (x >= halfWidth && currentSlide < displayCount - 1) {
      onSlideChange(currentSlide + 1);
    }
  };

  const currentMedia = mediaItems[currentSlide];
  const isVideo = currentMedia && currentMedia.type === 'video';

  return (
    <div className="story-container" onClick={handleTap} style={{ cursor: 'pointer' }}>
      <StatusBar dark device={device} theme={theme} />
      
      {isVideo ? (
        <VideoPlayer
          src={currentMedia.url}
          poster={currentMedia.thumbnail}
          autoPlay
          defaultMuted={false}
          className="story-image"
          overlay="story"
          showControls={true}
        />
      ) : (
        <img className="story-image" src={displayImages[currentSlide] || PLACEHOLDER_IMAGE} alt="story" />
      )}

      {/* Progress bars */}
      <div className="story-progress-bar">
        {Array.from({ length: displayCount }).map((_, idx) => (
          <div className="story-progress-segment" key={idx}>
            <div
              className="story-progress-fill"
              style={{
                width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="story-header">
        <div className="story-profile-pic">
          <img src={profilePic || DEFAULT_PROFILE_PIC} alt="profile" />
        </div>
        <span className="story-username">{username || 'username'}</span>
        <span className="story-time">2h</span>
        <span className="story-close">×</span>
      </div>

      {/* Bottom */}
      <div className="story-bottom">
        <input className="story-reply-input" placeholder="Send message" readOnly />
        <span className="story-action">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
        <span className="story-action">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default StoryPreview;
