import React, { useState } from 'react';
import InstagramPreview from './components/InstagramPreview';
import ControlsPanel from './components/ControlsPanel';
import type { PostData } from './types';
import { DEFAULT_PROFILE_PIC } from './utils/constants';

const defaultPostData: PostData = {
  username: 'designstudio',
  profilePic: DEFAULT_PROFILE_PIC,
  location: 'Los Angeles, California',
  isVerified: true,
  images: [],
  mediaItems: [],
  caption: 'Creating something amazing today ✨ Every design tells a story.',
  hashtags: '#design #creative #instagram #preview #canva',
  likesCount: 4829,
  commentsCount: 142,
  previewType: 'feed',
  aspectRatio: '1:1',
  currentSlide: 0,
  timeAgo: '2 hours ago',
  deviceType: 'ios',
  theme: 'light',
};

const App: React.FC = () => {
  const [postData, setPostData] = useState<PostData>(defaultPostData);

  const handleChange = (updates: Partial<PostData>) => {
    setPostData((prev: PostData) => ({ ...prev, ...updates }));
  };

  const handleSlideChange = (slide: number) => {
    setPostData((prev: PostData) => ({ ...prev, currentSlide: slide }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '30px 20px',
    }}>
      {/* App Title */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          📱 Instagram Post Preview
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6 }}>
          Design and preview your Instagram content in real-time
        </p>
      </div>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        gap: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        maxWidth: 960,
        margin: '0 auto',
      }}>
        {/* Preview */}
        <div style={{ flexShrink: 0 }}>
          <InstagramPreview postData={postData} onSlideChange={handleSlideChange} />
        </div>

        {/* Controls */}
        <div style={{ flex: '1 1 340px', maxWidth: 400, minWidth: 300 }}>
          <ControlsPanel postData={postData} onChange={handleChange} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 30, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
        Instagram Preview Tool • For design mockup purposes only
      </div>
    </div>
  );
};

export default App;
