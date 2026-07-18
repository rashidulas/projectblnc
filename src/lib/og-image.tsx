import { ImageResponse } from 'next/og';

export const ogImageSize = { width: 1200, height: 630 };

export function renderDefaultOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#e7ebea',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#171717',
            lineHeight: 1.05,
          }}
        >
          Project BLNC
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: '#525252',
            letterSpacing: '-0.01em',
          }}
        >
          Luxury Streetwear — Redefining Essentials
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
