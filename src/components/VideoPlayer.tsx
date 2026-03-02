import React, { useRef, useState, useEffect } from 'react';
import { formatDuration } from '../utils/constants';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  defaultMuted?: boolean;
  className?: string;
  showControls?: boolean;
  overlay?: 'feed' | 'story' | 'reel';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  defaultMuted = true,
  className = '',
  showControls = true,
  overlay = 'feed',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;

    const handleTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleMeta = () => setDuration(video.duration || 0);

    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadedmetadata', handleMeta);

    if (autoPlay) {
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadedmetadata', handleMeta);
    };
  }, [src, autoPlay, isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const isStoryReel = overlay === 'story' || overlay === 'reel';

  return (
    <div className={`video-player-wrapper ${className}`} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        playsInline
        muted={isMuted}
        className="video-element"
      />

      {/* Play overlay */}
      {!isPlaying && showControls && (
        <div className="video-play-overlay">
          <div className={`video-play-btn ${isStoryReel ? 'story-reel' : ''}`}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute button */}
      {showControls && (
        <button className={`video-mute-btn ${isStoryReel ? 'story-reel' : ''}`} onClick={toggleMute}>
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      )}

      {/* Progress bar */}
      {showControls && !isStoryReel && (
        <div className="video-controls-bar">
          <div className="video-scrubber" onClick={(e) => { e.stopPropagation(); handleScrub(e); }}>
            <div className="video-scrubber-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="video-time-display">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
