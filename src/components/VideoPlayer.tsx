import React, { useRef, useEffect, useState } from 'react';
import { SpatialNavigationNode } from 'react-tv-space-navigation';
import type { Channel } from '../types';
import Hls from 'hls.js';

interface Props {
  channel: Channel;
  onClose: () => void;
}

export function VideoPlayer({ channel, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel.url) return;

    setLoading(true);
    setError(null);

    const isHls =
      channel.url.endsWith('.m3u8') || channel.url.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        setLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('HLS playback error');
          setLoading(false);
        }
      });
      return () => hls.destroy();
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.play().catch(() => {});
    } else {
      video.src = channel.url;
      video.play().catch(() => {});
    }

    const onCanPlay = () => setLoading(false);
    const onError = () => {
      setError('Playback failed');
      setLoading(false);
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);

    const timer = setTimeout(() => setLoading(false), 5000);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
      clearTimeout(timer);
    };
  }, [channel.url]);

  return (
    <div className="player-overlay">
      {/* Video */}
      <div className="player-video-wrapper">
        <video
          ref={videoRef}
          className="player-video"
          autoPlay
          playsInline
          onClick={onClose}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="player-overlay-ui">
          <div className="spinner" />
          <div className="player-status">Loading…</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="player-overlay-ui">
          <div className="player-error">{error}</div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="player-bottom-bar">
        <div className="player-channel-info">
          <div className="player-channel-logo">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="player-channel-img"
              />
            ) : (
              <div className="player-channel-placeholder">
                {channel.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="player-channel-name">{channel.name}</div>
        </div>

        <SpatialNavigationNode isFocusable onSelect={onClose}>
          {({ isFocused }: { isFocused: boolean }) => (
            <button
              className={`player-close-btn ${isFocused ? 'player-close-btn--focused' : ''}`}
            >
              ✕ Close
            </button>
          )}
        </SpatialNavigationNode>
      </div>
    </div>
  );
}
