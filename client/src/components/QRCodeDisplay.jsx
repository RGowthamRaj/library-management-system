import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ value, size = 128 }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (value) {
      QRCode.toDataURL(value, {
        width: size,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [value, size]);

  if (!value) return null;

  if (!qrDataUrl) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="inline-block">
      <img
        src={qrDataUrl}
        alt={`QR Code for ${value}`}
        className="mx-auto rounded-lg"
        style={{ width: size, height: size }}
      />
      <p className="text-xs text-gray-400 text-center mt-1 font-mono truncate max-w-[150px]">
        {value.substring(0, 12)}...
      </p>
    </div>
  );
}
