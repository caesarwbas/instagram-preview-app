import React, { useRef, useState } from 'react';
import { MAX_CAPTION_LENGTH, MAX_HASHTAGS, MAX_IMAGES, DEFAULT_PROFILE_PIC, formatDuration, extractVideoThumbnail, getVideoDuration, MAX_VIDEO_SIZE_MB } from '../utils/constants';
import type { PostData, PreviewType, AspectRatio, MediaItem } from '../types';
import DeviceSelector from './DeviceSelector';
import ThemeToggle from './ThemeToggle';
import CropModal from './CropModal';

interface ControlsPanelProps {
  postData: PostData;
  onChange: (updates: Partial<PostData>) => void;
}

const countHashtags = (text: string): number => {
  const matches = text.match(/#\w+/g);
  return matches ? matches.length : 0;
};

const ControlsPanel: React.FC<ControlsPanelProps> = ({ postData, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageIndex, setCropImageIndex] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_IMAGES - postData.mediaItems.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    for (const file of filesToProcess) {
      const isVideo = file.type.startsWith('video/');

      if (isVideo) {
        // Validate file size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_VIDEO_SIZE_MB) {
          alert(`Video "${file.name}" exceeds ${MAX_VIDEO_SIZE_MB}MB limit.`);
          continue;
        }

        setUploadingVideo(true);
        try {
          const url = URL.createObjectURL(file);
          const [thumbnail, duration] = await Promise.all([
            extractVideoThumbnail(file),
            getVideoDuration(file),
          ]);

          const newMedia: MediaItem = {
            type: 'video',
            url,
            originalUrl: url,
            thumbnail,
            duration,
            fileName: file.name,
          };
          onChange({
            mediaItems: [...postData.mediaItems, newMedia],
            images: [...postData.images, thumbnail],
            currentSlide: 0,
          });
        } catch (err) {
          console.error('Video processing failed:', err);
          alert('Could not process video. Try another file.');
        }
        setUploadingVideo(false);
      } else {
        // Image
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          const newMedia: MediaItem = {
            type: 'image',
            url: result,
            originalUrl: result,
          };
          onChange({
            mediaItems: [...postData.mediaItems, newMedia],
            images: [...postData.images, result],
            currentSlide: 0,
          });
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ profilePic: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = (idx: number) => {
    const newMediaItems = postData.mediaItems.filter((_: MediaItem, i: number) => i !== idx);
    const newImages = postData.images.filter((_: string, i: number) => i !== idx);
    onChange({
      mediaItems: newMediaItems,
      images: newImages,
      currentSlide: Math.min(postData.currentSlide, Math.max(0, newMediaItems.length - 1)),
    });
  };

  const openCropModal = (idx: number) => {
    setCropImageIndex(idx);
    setCropModalOpen(true);
  };

  const handleCropSave = (croppedImage: string) => {
    if (cropImageIndex === null) return;
    const newImages = [...postData.images];
    newImages[cropImageIndex] = croppedImage;
    const newMediaItems = [...postData.mediaItems];
    if (newMediaItems[cropImageIndex]) {
      newMediaItems[cropImageIndex] = {
        ...newMediaItems[cropImageIndex],
        url: croppedImage,
      };
    }
    onChange({ images: newImages, mediaItems: newMediaItems });
    setCropModalOpen(false);
    setCropImageIndex(null);
  };

  const hashtagCount = countHashtags(postData.hashtags);
  const captionLength = postData.caption.length;

  return (
    <div className="controls-panel" style={{ width: 380 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="#e1306c" stroke="none" />
        </svg>
        Instagram Preview
      </h2>

      {/* Device & Theme */}
      <div className="control-section">
        <div className="control-label">📱 Device & Theme</div>
        <DeviceSelector device={postData.deviceType} onChange={(d) => onChange({ deviceType: d })} />
        <div style={{ marginTop: 10 }} />
        <ThemeToggle theme={postData.theme} onChange={(t) => onChange({ theme: t })} />
      </div>

      {/* Preview Type */}
      <div className="control-section">
        <div className="control-label">📷 Post Type</div>
        <div className="preview-type-tabs">
          {(['feed', 'story', 'reel'] as PreviewType[]).map((type) => (
            <button
              key={type}
              className={`preview-type-tab ${postData.previewType === type ? 'active' : ''}`}
              onClick={() => {
                const updates: Partial<PostData> = { previewType: type };
                if (type === 'story' || type === 'reel') {
                  updates.aspectRatio = '9:16';
                } else if (type === 'feed' && postData.aspectRatio === '9:16') {
                  updates.aspectRatio = '1:1';
                }
                onChange(updates);
              }}
            >
              {type === 'feed' ? '📷' : type === 'story' ? '📱' : '🎬'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio (Feed only) */}
      {postData.previewType === 'feed' && (
        <div className="control-section">
          <div className="control-label">Aspect Ratio</div>
          <div className="aspect-tabs">
            {(['1:1', '4:5', '16:9'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                className={`aspect-tab ${postData.aspectRatio === ratio ? 'active' : ''}`}
                onClick={() => onChange({ aspectRatio: ratio })}
              >
                {ratio} {ratio === '1:1' ? '□' : ratio === '4:5' ? '▯' : '▭'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Media */}
      <div className="control-section">
        <div className="control-label">
          🖼️ Media
          <span className="control-sublabel">{postData.mediaItems.length}/{MAX_IMAGES}</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,video/mov,video/avi,video/webm"
          multiple
          onChange={handleMediaUpload}
          style={{ display: 'none' }}
        />
        <div
          className="image-upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadingVideo ? (
            <div style={{ padding: 10 }}>
              <div className="upload-spinner" />
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8 }}>Processing video...</div>
            </div>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload images or videos</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>Up to {MAX_IMAGES} items • Images & Videos (.mp4, .mov, .webm)</div>
            </>
          )}
        </div>
        {postData.mediaItems.length > 0 && (
          <div className="image-thumbnails">
            {postData.mediaItems.map((media: MediaItem, idx: number) => (
              <div
                key={idx}
                className={`image-thumbnail ${idx === postData.currentSlide ? 'active' : ''}`}
                onClick={() => onChange({ currentSlide: idx })}
                style={{ cursor: 'pointer' }}
              >
                <img src={media.type === 'video' ? media.thumbnail || '' : media.url} alt={`thumb ${idx}`} />
                {/* Video overlay */}
                {media.type === 'video' && (
                  <div className="thumb-video-badge">
                    <span className="thumb-play-icon">▶</span>
                    {media.duration !== undefined && (
                      <span className="thumb-duration">{formatDuration(media.duration)}</span>
                    )}
                  </div>
                )}
                {/* Crop button (images only) */}
                {media.type === 'image' && (
                  <button
                    className="image-thumbnail-crop"
                    onClick={(e) => { e.stopPropagation(); openCropModal(idx); }}
                    title="Crop / Edit"
                  >
                    ✏️
                  </button>
                )}
                <button
                  className="image-thumbnail-remove"
                  onClick={(e) => { e.stopPropagation(); removeMedia(idx); }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="control-section">
        <div className="control-label">Profile</div>
        <div className="profile-pic-upload">
          <div className="profile-pic-preview" onClick={() => profileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
            <img src={postData.profilePic || DEFAULT_PROFILE_PIC} alt="profile" />
          </div>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileUpload}
            style={{ display: 'none' }}
          />
          <div style={{ flex: 1 }}>
            <input
              className="control-input"
              placeholder="Username"
              value={postData.username}
              onChange={(e) => onChange({ username: e.target.value })}
              style={{ marginBottom: 6 }}
            />
            <input
              className="control-input"
              placeholder="Location (optional)"
              value={postData.location}
              onChange={(e) => onChange({ location: e.target.value })}
            />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <label className="toggle-switch">
            <div className={`toggle-track ${postData.isVerified ? 'on' : ''}`} onClick={() => onChange({ isVerified: !postData.isVerified })}>
              <div className="toggle-thumb" />
            </div>
            <span style={{ fontSize: 13 }}>Verified badge ✓</span>
          </label>
        </div>
      </div>

      {/* Caption */}
      <div className="control-section">
        <div className="control-label">
          Caption
          <span className={`control-sublabel ${captionLength > MAX_CAPTION_LENGTH ? 'warning' : ''}`} style={captionLength > MAX_CAPTION_LENGTH ? { color: '#ed4956' } : {}}>
            {captionLength}/{MAX_CAPTION_LENGTH}
          </span>
        </div>
        <textarea
          className="control-input control-textarea"
          placeholder="Write a caption..."
          value={postData.caption}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CAPTION_LENGTH) {
              onChange({ caption: e.target.value });
            }
          }}
          rows={3}
        />
      </div>

      {/* Hashtags */}
      <div className="control-section">
        <div className="control-label">
          Hashtags
          <span className={`control-sublabel ${hashtagCount > MAX_HASHTAGS ? 'warning' : ''}`} style={hashtagCount > MAX_HASHTAGS ? { color: '#ed4956' } : {}}>
            {hashtagCount}/{MAX_HASHTAGS}
          </span>
        </div>
        <textarea
          className="control-input control-textarea"
          placeholder="#photography #travel #instagood"
          value={postData.hashtags}
          onChange={(e) => onChange({ hashtags: e.target.value })}
          rows={2}
          style={{ minHeight: 56 }}
        />
      </div>

      {/* Engagement */}
      <div className="control-section">
        <div className="control-label">Engagement</div>
        <div className="number-input-group">
          <div className="number-input-wrapper">
            <label>Likes</label>
            <input
              className="control-input"
              type="number"
              min={0}
              value={postData.likesCount}
              onChange={(e) => onChange({ likesCount: Math.max(0, parseInt(e.target.value) || 0) })}
            />
          </div>
          <div className="number-input-wrapper">
            <label>Comments</label>
            <input
              className="control-input"
              type="number"
              min={0}
              value={postData.commentsCount}
              onChange={(e) => onChange({ commentsCount: Math.max(0, parseInt(e.target.value) || 0) })}
            />
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="control-section">
        <div className="control-label">Time Ago</div>
        <input
          className="control-input"
          placeholder="2 hours ago"
          value={postData.timeAgo}
          onChange={(e) => onChange({ timeAgo: e.target.value })}
        />
      </div>

      {/* Crop Modal */}
      {cropModalOpen && cropImageIndex !== null && postData.mediaItems[cropImageIndex] && (
        <CropModal
          image={postData.mediaItems[cropImageIndex].originalUrl}
          onSave={handleCropSave}
          onCancel={() => { setCropModalOpen(false); setCropImageIndex(null); }}
        />
      )}
    </div>
  );
};

export default ControlsPanel;
