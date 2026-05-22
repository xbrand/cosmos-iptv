import React, { useEffect } from 'react';
import {
  SpatialNavigationRoot,
  SpatialNavigationNode,
} from 'react-tv-space-navigation';
import { useUIStore, useChannelStore } from './store';
import {
  configureSpatialNavigation,
  setGlobalBackHandler,
} from './hooks/useSpatialNavigation';
import { ChannelsScreen } from './screens/ChannelsScreen';
import { FavouritesScreen } from './screens/FavouritesScreen';
import { EPGScreen } from './screens/EPGScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { VideoPlayer } from './components/VideoPlayer';
import type { Channel } from './types';
import './index.css';

const NAV_ITEMS = [
  { key: 'channels', label: 'Channels', icon: '📺' },
  { key: 'favourites', label: 'Favourites', icon: '★' },
  { key: 'epg', label: 'EPG', icon: '📋' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
] as const;

export default function App() {
  const { activeView, setActiveView, isPlayerVisible, setPlayerVisible } = useUIStore();
  const { currentChannel } = useChannelStore();

  useEffect(() => {
    const cleanup = configureSpatialNavigation();

    // Register global back-button handler
    setGlobalBackHandler(() => {
      if (isPlayerVisible) {
        setPlayerVisible(false);
        useChannelStore.getState().setCurrentChannel(null);
      }
    });

    return cleanup;
  }, [isPlayerVisible]);

  const handlePlay = (channel: Channel) => {
    useChannelStore.getState().setCurrentChannel(channel);
    useUIStore.getState().setPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setPlayerVisible(false);
    useChannelStore.getState().setCurrentChannel(null);
  };

  return (
    <SpatialNavigationRoot>
      <div className="app-root">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-text">COSMOS</span>
            <span className="logo-sub">IPTV</span>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.key}
                label={item.label}
                icon={item.icon}
                isActive={activeView === item.key}
                onSelect={() => setActiveView(item.key)}
              />
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="main-content">
          {activeView === 'channels' && <ChannelsScreen onPlay={handlePlay} />}
          {activeView === 'favourites' && <FavouritesScreen onPlay={handlePlay} />}
          {activeView === 'epg' && (
            <EPGScreen
              onPlayChannel={(id) => {
                const ch = useChannelStore.getState().channels.find((c) => c.id === id);
                if (ch) handlePlay(ch);
              }}
            />
          )}
          {activeView === 'settings' && <SettingsScreen />}
        </main>

        {/* Video Player overlay */}
        {isPlayerVisible && currentChannel && (
          <VideoPlayer
            channel={currentChannel}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </SpatialNavigationRoot>
  );
}

// ─── Nav item ──────────────────────────────────────────────────────────────────

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onSelect: () => void;
}> = ({ label, icon, isActive, onSelect }) => (
  <SpatialNavigationNode isFocusable onSelect={onSelect}>
    {({ isFocused }: { isFocused: boolean }) => (
      <div
        className={[
          'nav-item',
          isActive ? 'nav-item--active' : '',
          isFocused && !isActive ? 'nav-item--focused' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="nav-icon">{icon}</span>
        <span className="nav-label">{label}</span>
        {isActive && <div className="nav-indicator" />}
      </div>
    )}
  </SpatialNavigationNode>
);
