import type { Channel } from '../types';
import { nanoid } from 'nanoid';

/**
 * Parse an M3U playlist string into Channel objects.
 * Handles extended M3U (#EXTINF) format.
 */
export function parseM3U(content: string): Channel[] {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const items: Channel[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('#EXTM3U')) {
      i++;
      continue;
    }

    if (line.startsWith('#EXTINF:')) {
      const info = line.slice(8);
      const attrs = parseExtInfAttrs(info);

      i++;
      if (i < lines.length && !lines[i].startsWith('#')) {
        const url = lines[i];
        items.push({
          id: attrs.tvgid || nanoid(),
          name: attrs.tvgname || `Channel ${items.length + 1}`,
          url,
          logo: attrs.tvglogo,
          group: attrs.group,
          tvgId: attrs.tvgid,
        });
      }
    }
    i++;
  }

  return items;
}

function parseExtInfAttrs(info: string): Record<string, string> {
  const attrs: Record<string, string> = {};

  // key="value" patterns
  const quoted = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
  let m;
  while ((m = quoted.exec(info)) !== null) {
    attrs[m[1].toLowerCase()] = m[2];
  }

  // key=value (no quotes)
  const bare = /([a-zA-Z0-9_-]+)=(\S+)/g;
  while ((m = bare.exec(info)) !== null) {
    if (!attrs[m[1].toLowerCase()]) {
      attrs[m[1].toLowerCase()] = m[2];
    }
  }

  // After last comma, the channel name
  const commaIdx = info.lastIndexOf(',');
  if (commaIdx !== -1) {
    const name = info.slice(commaIdx + 1).trim();
    if (name && !attrs.tvgname) attrs.tvgname = name;
  }

  return attrs;
}

/**
 * Group channels by their group label.
 */
export function groupChannelsByGroup(channels: Channel[]): Record<string, Channel[]> {
  const groups: Record<string, Channel[]> = {};
  for (const ch of channels) {
    const g = ch.group || 'Ungrouped';
    if (!groups[g]) groups[g] = [];
    groups[g].push(ch);
  }
  return groups;
}
