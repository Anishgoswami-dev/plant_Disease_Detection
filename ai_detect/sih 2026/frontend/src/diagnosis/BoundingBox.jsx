import React from 'react';
import DetectionLabel from './DetectionLabel.jsx';

/**
 * 📦 BoundingBox Component
 * Renders a responsive localization box with corner accents and label.
 * Coordinates are percentage-based ({ x, y, width, height } in 0-100%).
 */
export default function BoundingBox({ detection }) {
  if (!detection || !detection.bbox) return null;

  let x = 0, y = 0, width = 0, height = 0;

  if (Array.isArray(detection.bbox)) {
    const [x1, y1, x2, y2] = detection.bbox;
    if (x2 <= 1 && y2 <= 1 && (x2 > 0 || y2 > 0)) {
      x = x1 * 100;
      y = y1 * 100;
      width = (x2 - x1) * 100;
      height = (y2 - y1) * 100;
    } else if (detection.image_width && detection.image_height) {
      x = (x1 / detection.image_width) * 100;
      y = (y1 / detection.image_height) * 100;
      width = ((x2 - x1) / detection.image_width) * 100;
      height = ((y2 - y1) / detection.image_height) * 100;
    } else if (x2 > 100 || y2 > 100) {
      const refW = Math.max(x2, 640);
      const refH = Math.max(y2, 640);
      x = (x1 / refW) * 100;
      y = (y1 / refH) * 100;
      width = ((x2 - x1) / refW) * 100;
      height = ((y2 - y1) / refH) * 100;
    } else {
      x = x1;
      y = y1;
      width = x2 - x1;
      height = y2 - y1;
    }
  } else if (typeof detection.bbox === 'object') {
    x = detection.bbox.x || 0;
    y = detection.bbox.y || 0;
    width = detection.bbox.width || 0;
    height = detection.bbox.height || 0;
    if (x <= 1 && y <= 1 && width <= 1 && height <= 1 && (width > 0 || height > 0)) {
      x *= 100;
      y *= 100;
      width *= 100;
      height *= 100;
    }
  }

  x = Math.max(0, Math.min(100, x));
  y = Math.max(0, Math.min(100, y));
  width = Math.max(2, Math.min(100 - x, width));
  height = Math.max(2, Math.min(100 - y, height));

  const style = {
    left: `${x.toFixed(1)}%`,
    top: `${y.toFixed(1)}%`,
    width: `${width.toFixed(1)}%`,
    height: `${height.toFixed(1)}%`
  };

  return (
    <div className="yolo-bounding-box" style={style}>
      {/* Corner indicators */}
      <div className="yolo-corner tl" />
      <div className="yolo-corner tr" />
      <div className="yolo-corner bl" />
      <div className="yolo-corner br" />

      {/* Floating detection label */}
      <DetectionLabel
        label={detection.label || 'Disease Spot'}
        confidence={detection.confidence}
      />
    </div>
  );
}
