import React from 'react';
import StatusBar from './StatusBar';
import PostHeader from './PostHeader';
import ImageCarousel from './ImageCarousel';
import PostActions from './PostActions';
import StoryPreview from './StoryPreview';
import ReelPreview from './ReelPreview';
import type { PostData } from '../types';

interface InstagramPreviewProps {
  postData: PostData;
  onSlideChange: (slide: number) => void;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({ postData, onSlideChange }) => {
  const {
    username,
    profilePic,
    location,
    isVerified,
    images,
    mediaItems,
    caption,
    hashtags,
    likesCount,
    commentsCount,
    previewType,
    aspectRatio,
    currentSlide,
    timeAgo,
    deviceType,
    theme,
  } = postData;

  const isStoryOrReel = previewType === 'story' || previewType === 'reel';
  const isDark = theme === 'dark';
  const isIos = deviceType === 'ios';

  return (
    <div className={`phone-frame ${isIos ? 'ios' : 'android'}`} style={{ margin: '0 auto' }}>
      {/* Dynamic Island / Notch */}
      {isIos ? (
        <div className="phone-dynamic-island" />
      ) : (
        <div className="phone-punch-hole" />
      )}

      <div
        className={`phone-screen ${isDark ? 'dark-theme' : 'light-theme'}`}
        style={{ height: isStoryOrReel ? 708 : 'auto', maxHeight: 750, overflow: 'hidden' }}
      >
        {previewType === 'story' ? (
          <div style={{ height: 708, position: 'relative' }}>
            <StoryPreview
              images={images}
              mediaItems={mediaItems}
              username={username}
              profilePic={profilePic}
              currentSlide={currentSlide}
              onSlideChange={onSlideChange}
              device={deviceType}
              theme={theme}
            />
          </div>
        ) : previewType === 'reel' ? (
          <div style={{ height: 708, position: 'relative' }}>
            <ReelPreview
              images={images}
              mediaItems={mediaItems}
              username={username}
              profilePic={profilePic}
              caption={caption}
              hashtags={hashtags}
              isVerified={isVerified}
              likesCount={likesCount}
              commentsCount={commentsCount}
              currentSlide={currentSlide}
              device={deviceType}
              theme={theme}
            />
          </div>
        ) : (
          <>
            <StatusBar device={deviceType} theme={theme} />
            {/* Instagram app header */}
            <div className={`ig-header ${isDark ? 'dark' : ''}`}>
              <div className="ig-logo">Instagram</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <button className="action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button className="action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>

            <PostHeader
              username={username}
              profilePic={profilePic}
              location={location}
              isVerified={isVerified}
              theme={theme}
            />

            <ImageCarousel
              images={images}
              mediaItems={mediaItems}
              aspectRatio={aspectRatio}
              currentSlide={currentSlide}
              onSlideChange={onSlideChange}
            />

            <PostActions
              likesCount={likesCount}
              commentsCount={commentsCount}
              username={username}
              caption={caption}
              hashtags={hashtags}
              timeAgo={timeAgo}
              imagesCount={Math.max(images.length, mediaItems.length)}
              currentSlide={currentSlide}
              onSlideChange={onSlideChange}
              theme={theme}
            />
          </>
        )}
      </div>

      {/* Bottom gesture bar / nav buttons */}
      {isIos ? (
        <div className="phone-gesture-bar" />
      ) : (
        <div className="phone-android-nav">
          <div className="android-nav-btn">◁</div>
          <div className="android-nav-btn">○</div>
          <div className="android-nav-btn">□</div>
        </div>
      )}
    </div>
  );
};

export default InstagramPreview;
