import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import type { CropAspect } from '../types';
import { CROP_ASPECT_VALUES, getCroppedImg } from '../utils/constants';

interface CropModalProps {
  image: string;
  onSave: (croppedImage: string) => void;
  onCancel: () => void;
}

const CropModal: React.FC<CropModalProps> = ({ image, onSave, onCancel }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectMode, setAspectMode] = useState<CropAspect>('1:1');
  const [showGrid, setShowGrid] = useState(true);

  const aspect = CROP_ASPECT_VALUES[aspectMode];

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels, rotation, flipH, flipV);
      onSave(cropped);
    } catch (e) {
      console.error('Crop failed:', e);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectMode('1:1');
  };

  const aspectOptions: { label: string; value: CropAspect }[] = [
    { label: '1:1', value: '1:1' },
    { label: '4:5', value: '4:5' },
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' },
    { label: 'Free', value: 'free' },
  ];

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-header">
          <h3>Edit Image</h3>
          <button className="crop-close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={showGrid}
            style={{
              containerStyle: { borderRadius: 8 },
              mediaStyle: { transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})` },
            }}
          />
        </div>

        {/* Aspect Ratio Buttons */}
        <div className="crop-aspect-row">
          {aspectOptions.map((opt) => (
            <button
              key={opt.value}
              className={`crop-aspect-btn ${aspectMode === opt.value ? 'active' : ''}`}
              onClick={() => setAspectMode(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="crop-control-row">
          <label>Zoom</label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="crop-slider"
          />
          <span className="crop-value">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Rotation */}
        <div className="crop-control-row">
          <label>Rotate</label>
          <div className="crop-rotate-btns">
            <button className="crop-icon-btn" onClick={() => setRotation((r) => r - 90)} title="Rotate Left">
              ↺
            </button>
            <button className="crop-icon-btn" onClick={() => setRotation((r) => r + 90)} title="Rotate Right">
              ↻
            </button>
            <button className={`crop-icon-btn ${flipH ? 'active' : ''}`} onClick={() => setFlipH(!flipH)} title="Flip Horizontal">
              ⇔
            </button>
            <button className={`crop-icon-btn ${flipV ? 'active' : ''}`} onClick={() => setFlipV(!flipV)} title="Flip Vertical">
              ⇕
            </button>
          </div>
        </div>

        {/* Grid toggle */}
        <div className="crop-control-row">
          <label>Grid overlay</label>
          <div
            className={`toggle-track ${showGrid ? 'on' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            style={{ cursor: 'pointer' }}
          >
            <div className="toggle-thumb" />
          </div>
        </div>

        {/* Actions */}
        <div className="crop-actions">
          <button className="crop-btn-secondary" onClick={handleReset}>Reset</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="crop-btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="crop-btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
