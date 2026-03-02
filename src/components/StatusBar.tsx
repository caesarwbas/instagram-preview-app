import React from 'react';
import type { DeviceType, ThemeMode } from '../types';

interface StatusBarProps {
  dark?: boolean;
  device?: DeviceType;
  theme?: ThemeMode;
}

const StatusBar: React.FC<StatusBarProps> = ({ dark = false, device = 'ios', theme = 'light' }) => {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const isDark = dark || theme === 'dark';

  if (device === 'android') {
    return (
      <div className={`status-bar status-bar-android ${isDark ? 'status-bar-dark' : ''}`}>
        <span className="status-time-android">{time}</span>
        <div className="status-icons">
          {/* Android Signal */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 22h20L12 2 2 22zm10-2H8l4-14 4 14h-4z" opacity="0.3"/>
            <path d="M1 21h22L12 2 1 21zm3.47-2L12 5.99 19.53 19H4.47z"/>
          </svg>
          {/* Android WiFi */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          {/* Android Battery */}
          <svg width="18" height="12" viewBox="0 0 24 14" fill="currentColor">
            <rect x="1" y="2" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <rect x="3" y="4" width="12" height="6" rx="0.5"/>
            <rect x="20" y="5" width="2.5" height="4" rx="0.5"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`status-bar status-bar-ios ${isDark ? 'status-bar-dark' : ''}`}>
      <span className="status-time-ios">{time}</span>
      <div className="status-icons">
        {/* iOS Signal */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3.5 7.5C5 6 6.5 5.5 8 5.5s3 .5 4.5 2l-1 1C10.5 7.5 9.5 7 8 7s-2.5.5-3.5 1.5l-1-1zM1 5c2-2 4-3 7-3s5 1 7 3l-1 1c-1.5-1.5-3.5-2.5-6-2.5S3.5 4.5 2 6L1 5z" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
          <rect x="2" y="3" width="15" height="6" rx="1" />
          <path d="M22 4.5v3a1.5 1.5 0 000-3z" />
        </svg>
      </div>
    </div>
  );
};

export default StatusBar;
