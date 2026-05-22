import React, { useState } from 'react';
import { SpatialNavigationNode } from 'react-tv-space-navigation';
import { useSettingsStore, useChannelStore } from '../store';
import { parseM3U } from '../services/m3u';

export function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const { setChannels } = useChannelStore();

  const [m3uUrl, setM3uUrl] = useState(settings.m3uUrl);
  const [epgUrl, setEpgUrl] = useState(settings.epgUrl);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoadPlaylist = async () => {
    updateSettings({ m3uUrl, epgUrl });
    setLoadError(null);
    setSuccessMsg(null);

    if (!m3uUrl) {
      setLoadError('Please enter an M3U playlist URL');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(m3uUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const items = parseM3U(text);
      setChannels(items);
      setSuccessMsg(`✓ Loaded ${items.length} channels`);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPlayToggle = () => {
    updateSettings({ autoPlay: !settings.autoPlay });
  };

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-form">
        {/* M3U URL */}
        <div className="settings-section">
          <label className="settings-label">M3U Playlist URL</label>
          <input
            className="settings-input"
            type="url"
            value={m3uUrl}
            onChange={(e) => setM3uUrl(e.target.value)}
            placeholder="https://example.com/playlist.m3u"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <div className="settings-hint">
            Enter the URL of your M3U playlist to load channels.
          </div>
        </div>

        {/* EPG URL */}
        <div className="settings-section">
          <label className="settings-label">EPG / XMLTV URL (optional)</label>
          <input
            className="settings-input"
            type="url"
            value={epgUrl}
            onChange={(e) => setEpgUrl(e.target.value)}
            placeholder="https://example.com/epg.xml"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <div className="settings-hint">
            Enter your XMLTV file URL for programme guide data.
          </div>
        </div>

        {/* Load button */}
        <SpatialNavigationNode isFocusable onSelect={handleLoadPlaylist}>
          {({ isFocused }: { isFocused: boolean }) => (
            <button
              className={`settings-button ${isFocused ? 'settings-button--focused' : ''}`}
            >
              {loading ? 'Loading…' : 'Load Playlist'}
            </button>
          )}
        </SpatialNavigationNode>

        {loadError && <div className="settings-error">{loadError}</div>}
        {successMsg && <div className="settings-success">{successMsg}</div>}

        {/* Auto-play toggle */}
        <div className="settings-section">
          <div className="settings-toggle-row">
            <div>
              <div
                className="settings-label"
                style={{ marginBottom: 0 }}
              >
                Auto-play on launch
              </div>
              <div className="settings-hint">
                Automatically play last watched channel
              </div>
            </div>
            <SpatialNavigationNode isFocusable onSelect={handleAutoPlayToggle}>
              {({ isFocused }: { isFocused: boolean }) => (
                <button
                  className={[
                    'settings-toggle',
                    isFocused ? 'settings-toggle--focused' : '',
                    settings.autoPlay ? 'settings-toggle--on' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {settings.autoPlay ? '[X] On' : '[ ] Off'}
                </button>
              )}
            </SpatialNavigationNode>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <div className="settings-version">Cosmos IPTV v1.0.0</div>
      </div>
    </div>
  );
}
