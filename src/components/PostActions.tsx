import React, { useState } from 'react';
import { formatNumber } from '../utils/constants';
import type { ThemeMode } from '../types';

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  username: string;
  caption: string;
  hashtags: string;
  timeAgo: string;
  imagesCount: number;
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  theme?: ThemeMode;
}

const PostActions: React.FC<PostActionsProps> = ({
  likesCount,
  commentsCount,
  username,
  caption,
  hashtags,
  timeAgo,
  imagesCount,
  currentSlide,
  onSlideChange,
  theme = 'light',
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Actions row */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button className="action-btn" onClick={() => setLiked(!liked)}>
            {liked ? (
              <svg width="24" height="24" viewBox="0 0 48 48" fill="#ed4956">
                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </button>
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Carousel dots inline */}
        {imagesCount > 1 && (
          <div className="carousel-dots-inline">
            {Array.from({ length: imagesCount }).map((_, idx: number) => (
              <div
                key={idx}
                className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => onSlideChange(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        )}

        <button className="action-btn" onClick={() => setSaved(!saved)}>
          {saved ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Likes */}
      <div className="post-likes">
        {formatNumber(liked ? likesCount + 1 : likesCount)} likes
      </div>

      {/* Caption */}
      {(caption || hashtags) && (
        <div className="post-caption">
          <span className="cap-username">{username || 'username'}</span>
          <span>{caption}</span>
          {hashtags && (
            <>
              {' '}
              <span className="cap-hashtags">{hashtags}</span>
            </>
          )}
        </div>
      )}

      {/* Comments link */}
      {commentsCount > 0 && (
        <div className="post-comments-link">
          View all {formatNumber(commentsCount)} comments
        </div>
      )}

      {/* Time */}
      <div className="post-time">{timeAgo || '2 hours ago'}</div>
    </div>
  );
};

export default PostActions;
