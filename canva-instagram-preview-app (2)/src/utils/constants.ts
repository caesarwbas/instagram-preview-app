export const MAX_CAPTION_LENGTH = 2200;
export const MAX_HASHTAGS = 30;
export const MAX_IMAGES = 10;
export const MAX_VIDEO_SIZE_MB = 100;
export const MAX_VIDEO_DURATION_FEED = 60;
export const MAX_VIDEO_DURATION_REEL = 90;

export const ASPECT_RATIOS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1, height: 1 },
  '4:5': { width: 4, height: 5 },
  '16:9': { width: 16, height: 9 },
  '9:16': { width: 9, height: 16 },
};

export const CROP_ASPECT_VALUES: Record<string, number | undefined> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  'free': undefined,
};

export const DEFAULT_PROFILE_PIC = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#833ab4"/>
      <stop offset="50%" style="stop-color:#fd1d1d"/>
      <stop offset="100%" style="stop-color:#fcb045"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="50" fill="#c7c7c7"/>
  <circle cx="50" cy="38" r="16" fill="#fff"/>
  <ellipse cx="50" cy="75" rx="26" ry="20" fill="#fff"/>
</svg>`);

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f0f0f0"/>
  <text x="200" y="190" text-anchor="middle" font-family="Arial" font-size="18" fill="#999">Click + to add images</text>
  <text x="200" y="215" text-anchor="middle" font-family="Arial" font-size="14" fill="#bbb">or use the upload button</text>
  <rect x="170" y="240" width="60" height="60" rx="8" fill="none" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
  <line x1="200" y1="255" x2="200" y2="285" stroke="#ccc" stroke-width="2"/>
  <line x1="185" y1="270" x2="215" y2="270" stroke="#ccc" stroke-width="2"/>
</svg>`);

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const extractVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.currentTime = 1;
    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } else {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas context'));
        }
      } catch {
        URL.revokeObjectURL(url);
        reject(new Error('Could not extract thumbnail'));
      }
    }, { once: true });
    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load video'));
    }, { once: true });
    video.load();
  });
};

export const getVideoDuration = (videoFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    }, { once: true });
    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load video metadata'));
    }, { once: true });
    video.load();
  });
};

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flipH = false,
  flipV = false,
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2d context');

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(radians);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.92);
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}
