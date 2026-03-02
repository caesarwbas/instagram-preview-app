import React from 'react';
import { PLACEHOLDER_IMAGE, DEFAULT_PROFILE_PIC, formatNumber } from '../utils/constants';
import StatusBar from './StatusBar';
import VideoPlayer from './VideoPlayer';
import type { DeviceType, ThemeMode, MediaItem } from '../types';

interface ReelPreviewProps {
  images: string[];
  mediaItems: MediaItem[];
  username: string;
  profilePic: string;
  caption: string;
  hashtags: string;
  isVerified: boolean;
  likesCount: number;
  commentsCount: number;
  currentSlide: number;
  device?: DeviceType;
  theme?: ThemeMode;
}

const ReelPreview: React.FC<ReelPreviewProps> = ({
  images, mediaItems, username, profilePic, caption, hashtags,
  isVerified, likesCount, commentsCount, currentSlide,
  device = 'ios', theme = 'light',
}) => {
  const displayImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const currentMedia = mediaItems[currentSlide];
  const isVideo = currentMedia && currentMedia.type === 'video';
  const displayCaption = caption.length > 60 ? caption.substring(0, 60) + '... more' : caption;

  return (
    <div className={`reel-container ${device === 'android' ? 'android-device' : 'ios-device'}`}>
      <StatusBar dark device={device} theme={theme} />

      {isVideo ? (
        <VideoPlayer
          src={currentMedia.url}
          poster={currentMedia.thumbnail}
          autoPlay
          defaultMuted={false}
          className="reel-image"
          overlay="reel"
          showControls={true}
        />
      ) : (
        <img className="reel-image" src={displayImages[currentSlide] || displayImages[0]} alt="reel" />
      )}

      {/* Reel header label */}
      <div className="reel-header-label">
        Reels
      </div>
      <div className="reel-header-camera">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="#fff" stroke="none" />
        </svg>
      </div>

      {/* Right side actions */}
      <div className="reel-right-actions">
        <div className="reel-action-item">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="reel-action-count">{formatNumber(likesCount)}</span>
        </div>
        <div className="reel-action-item">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="reel-action-count">{formatNumber(commentsCount)}</span>
        </div>
        <div className="reel-action-item">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
        <div className="reel-action-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <circle cx="12" cy="5" r="2" fill="#fff" />
            <circle cx="12" cy="12" r="2" fill="#fff" />
            <circle cx="12" cy="19" r="2" fill="#fff" />
          </svg>
        </div>
        <div className="reel-album-art"></div>
      </div>

      {/* Bottom info */}
      <div className="reel-bottom-info">
        <div className="reel-username">
          <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', flexShrink: 0 }}>
            <img src={profilePic || DEFAULT_PROFILE_PIC} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span>{username || 'username'}</span>
          {isVerified && (
            <svg width="14" height="14" viewBox="0 0 40 40" fill="#0095f6">
              <path d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.436-3.137V5.15h-6.234L25.358 0l-5.36 3.094zm-1.13 24.16l-7.26-7.26 2.828-2.828 4.432 4.432 8.61-8.61 2.828 2.828-11.438 11.438z" />
            </svg>
          )}
          <button style={{ background: 'transparent', border: '1px solid #fff', borderRadius: 6, padding: '4px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Follow
          </button>
        </div>
        {(displayCaption || hashtags) && (
          <div className="reel-caption-text">
            {displayCaption}
            {hashtags && <span style={{ color: '#e0e0ff' }}> {hashtags.substring(0, 50)}</span>}
          </div>
        )}
        <div className="reel-music">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" fill="#fff" /><circle cx="18" cy="16" r="3" fill="#fff" />
          </svg>
          <span>{username || 'username'} · Original audio</span>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="reel-bottom-nav">
        <div className="reel-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        </div>
        <div className="reel-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <div className="reel-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        </div>
        <div className="reel-nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5"><path d="M4 11.5V3h6l2 3h8v5.5M2 16l6-3 4 4 4-3 6 3v5H2z" /></svg>
        </div>
        <div className="reel-nav-item">
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#666', border: '2px solid #fff' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ReelPreview;
