import React, { useState } from 'react';
import { SpatialNavigationNode } from 'react-tv-space-navigation';
import { useChannelStore } from '../store';
import type { EPGProgram } from '../types';

const HOUR_W = 160;
const DAY_START = new Date();
DAY_START.setHours(0, 0, 0, 0);

function hourLabel(h: number): string {
  const d = new Date(DAY_START);
  d.setHours(h);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function programStyle(program: EPGProgram): React.CSSProperties {
  const startH =
    (program.start.getTime() - DAY_START.getTime()) / 3600000;
  const durH = program.duration / 3600000;
  return {
    left: startH * HOUR_W + 120,
    width: Math.max(durH * HOUR_W - 2, 20),
    top: 0,
    bottom: 0,
  };
}

function buildMockEPG(channelIds: string[]) {
  return channelIds.slice(0, 15).map((id, ci) => {
    const programs: EPGProgram[] = [];
    let cursor = new Date(DAY_START);
    for (let i = 0; i < 8; i++) {
      const dur = (Math.random() * 2 + 0.5) * 3600000;
      const end = new Date(cursor.getTime() + dur);
      programs.push({
        id: `${id}-${i}`,
        channelId: id,
        title: `Programme ${i + 1}`,
        description: `Description for programme ${i + 1}`,
        start: new Date(cursor),
        end,
        duration: dur,
      });
      cursor = end;
    }
    return { channelId: id, name: `Channel ${ci + 1}`, programs };
  });
}

interface Props {
  onPlayChannel: (channelId: string) => void;
}

export function EPGScreen({ onPlayChannel }: Props) {
  const { channels } = useChannelStore();
  const [selected, setSelected] = useState<EPGProgram | null>(null);

  if (channels.length === 0) {
    return (
      <div className="center-screen">
        <div className="empty-text">No channels for EPG</div>
        <div className="hint">Load a playlist in Settings first</div>
      </div>
    );
  }

  const epg = buildMockEPG(channels.map((c) => c.id));

  return (
    <div className="epg-screen">
      {/* Timeline header */}
      <div className="epg-header">
        <div className="epg-channel-col">Channel</div>
        <div className="epg-timeline">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="epg-hour" style={{ width: HOUR_W }}>
              {hourLabel(h)}
            </div>
          ))}
        </div>
      </div>

      {/* EPG rows */}
      <div className="epg-body">
        {epg.map(({ channelId, name, programs }) => (
          <div key={channelId} className="epg-row">
            <div className="epg-channel-name">{name}</div>
            <div className="epg-programs">
              {programs.map((p) => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <SpatialNavigationNode
                    isFocusable
                    onSelect={() => setSelected(p)}
                  >
                    {({ isFocused }: { isFocused: boolean }) => (
                      <div
                        className={`epg-program ${isFocused ? 'epg-program--focused' : ''}`}
                        style={programStyle(p)}
                      >
                        <div className="epg-program__title">{p.title}</div>
                        <div className="epg-program__time">
                          {fmtTime(p.start)} – {fmtTime(p.end)}
                        </div>
                      </div>
                    )}
                  </SpatialNavigationNode>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Programme detail */}
      {selected && (
        <div className="epg-detail">
          <div className="epg-detail__title">{selected.title}</div>
          <div className="epg-detail__time">
            {fmtTime(selected.start)} – {fmtTime(selected.end)}
          </div>
          {selected.description && (
            <div className="epg-detail__desc">{selected.description}</div>
          )}
          <div className="epg-detail__actions">
            <button
              className="epg-detail__watch"
              onClick={() => {
                onPlayChannel(selected.channelId);
                setSelected(null);
              }}
            >
              ▶ Watch
            </button>
            <button className="epg-detail__close" onClick={() => setSelected(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
