export type PreviewType = 'feed' | 'story' | 'reel';
export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';
export type DeviceType = 'ios' | 'android';
export type ThemeMode = 'light' | 'dark';
export type CropAspect = '1:1' | '4:5' | '16:9' | '9:16' | 'free';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  originalUrl: string;
  thumbnail?: string;
  duration?: number;
  fileName?: string;
}

export interface PostData {
  username: string;
  profilePic: string;
  location: string;
  isVerified: boolean;
  images: string[];
  mediaItems: MediaItem[];
  caption: string;
  hashtags: string;
  likesCount: number;
  commentsCount: number;
  previewType: PreviewType;
  aspectRatio: AspectRatio;
  currentSlide: number;
  timeAgo: string;
  deviceType: DeviceType;
  theme: ThemeMode;
}
