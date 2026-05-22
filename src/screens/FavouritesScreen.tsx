import React from 'react';
import { SpatialNavigationNode } from 'react-tv-space-navigation';
import { useFavouriteStore, useChannelStore } from '../store';
import type { Channel } from '../types';
import { groupChannelsByGroup } from '../services/m3u';

interface Props {
  onPlay: (channel: Channel) => void;
}

export function FavouritesScreen({ onPlay }: Props) {
  const { favouriteIds } = useFavouriteStore();
  const { channels } = useChannelStore();

  const favChannels = channels.filter((ch) => favouriteIds.includes(ch.id));

  if (favChannels.length === 0) {
    return (
      <div className="center-screen">
        <div className="empty-icon">☆</div>
        <div className="empty-text">No favourites yet</div>
        <div className="hint">Press ★ on any channel to add it here</div>
      </div>
    );
  }

  const grouped = groupChannelsByGroup(favChannels);

  return (
    <div className="favourites-screen">
      <div className="screen-header">
        <span className="screen-title">Favourites</span>
        <span className="screen-count">
          {favChannels.length} channel{favChannels.length !== 1 ? 's' : ''}
        </span>
      </div>
      {Object.entries(grouped).map(([group, chs]) => (
        <div key={group} className="channel-group">
          <div className="group-title">{group}</div>
          <div className="channel-grid">
            {chs.map((ch) => (
              <ChannelCard key={ch.id} channel={ch} onPlay={onPlay} />
            ))}
          </div>
        </div>
      ))}
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
