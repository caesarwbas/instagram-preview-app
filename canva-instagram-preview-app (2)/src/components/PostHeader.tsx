import React from 'react';
import { DEFAULT_PROFILE_PIC } from '../utils/constants';
import type { ThemeMode } from '../types';

interface PostHeaderProps {
  username: string;
  profilePic: string;
  location: string;
  isVerified: boolean;
  theme?: ThemeMode;
}

const PostHeader: React.FC<PostHeaderProps> = ({ username, profilePic, location, isVerified, theme = 'light' }) => {
  return (
    <div className={`post-header ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="profile-pic-ring">
        <div className="profile-pic-inner">
          <img src={profilePic || DEFAULT_PROFILE_PIC} alt="profile" />
        </div>
      </div>
      <div className="post-user-info">
        <div className="post-username">
          <span>{username || 'username'}</span>
          {isVerified && (
            <svg className="verified-badge" viewBox="0 0 40 40" fill="#0095f6">
              <path d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.436-3.137V5.15h-6.234L25.358 0l-5.36 3.094zm-1.13 24.16l-7.26-7.26 2.828-2.828 4.432 4.432 8.61-8.61 2.828 2.828-11.438 11.438z" />
            </svg>
          )}
        </div>
        {location && <div className="post-location">{location}</div>}
      </div>
      <button className="action-btn" style={{ marginLeft: 'auto' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
    </div>
  );
};

export default PostHeader;
