import React, { useState } from 'react';
import {
  SpatialNavigationNode,
  SpatialNavigationScrollView,
  SpatialNavigationView,
} from 'react-tv-space-navigation';
import { useChannelStore, useFavouriteStore } from '../store';
import type { Channel } from '../types';
import { groupChannelsByGroup } from '../services/m3u';

interface Props {
  onPlay: (channel: Channel) => void;
}

export function ChannelsScreen({ onPlay }: Props) {
  const { channels, isLoading, error } = useChannelStore();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="center-screen">
        <div className="spinner" />
        Loading channels…
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-screen">
        <div className="error-text">{error}</div>
        <div className="hint">Go to Settings to load an M3U playlist</div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="center-screen">
        <div className="empty-icon">📺</div>
        <div className="empty-text">No channels loaded</div>
        <div className="hint">Enter an M3U URL in Settings to get started</div>
      </div>
    );
  }

  const grouped = groupChannelsByGroup(channels);
  const groups = Object.keys(grouped).sort();
  const displayChannels = selectedGroup ? grouped[selectedGroup] : channels;

  return (
    <div className="channels-screen">
      {/* Group filter bar */}
      <div className="group-bar">
        <SpatialNavigationScrollView horizontal>
          <SpatialNavigationView direction="horizontal">
            <button
              className={`group-chip ${selectedGroup === null ? 'group-chip--active' : ''}`}
              onClick={() => setSelectedGroup(null)}
            >
              All
            </button>
            {groups.map((g) => (
              <button
                key={g}
                className={`group-chip ${selectedGroup === g ? 'group-chip--active' : ''}`}
                onClick={() => setSelectedGroup(g === selectedGroup ? null : g)}
              >
                {g}
              </button>
            ))}
          </SpatialNavigationView>
        </SpatialNavigationScrollView>
      </div>

      {/* Channel grid */}
      <div className="channel-grid">
        {displayChannels.map((ch) => (
          <ChannelCard key={ch.id} channel={ch} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}

const ChannelCard: React.FC<{ channel: Channel; onPlay: (ch: Channel) => void }> = ({
  channel,
  onPlay,
}) => {
  const toggleFav = useFavouriteStore((s) => s.toggleFavourite);
  const isFav = useFavouriteStore((s) => s.isFavourite(channel.id));

  return (
    <SpatialNavigationNode isFocusable onSelect={() => onPlay(channel)}>
      {({ isFocused }: { isFocused: boolean }) => (
        <div className={`channel-card ${isFocused ? 'channel-card--focused' : ''}`}>
          <div className="channel-card__logo">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="channel-card__img"
                loading="lazy"
              />
            ) : (
              <div className="channel-card__placeholder">
                {channel.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="channel-card__info">
            <div className="channel-card__name">{channel.name}</div>
            {channel.group && (
              <div className="channel-card__group">{channel.group}</div>
            )}
          </div>
          <button
            className="channel-card__fav"
            onClick={(e) => {
              e.stopPropagation();
              toggleFav(channel.id);
            }}
          >
            {isFav ? '★' : '☆'}
          </button>
          <div className="channel-card__play">▶</div>
        </div>
      )}
    </SpatialNavigationNode>
  );
}
