export interface Channel {
  id: string;
  name: string;
  logo?: string;
  group?: string;
  url: string;
  tvgId?: string;
}

export interface EPGProgram {
  id: string;
  channelId: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  duration: number;
}

export interface AppSettings {
  m3uUrl: string;
  epgUrl: string;
  autoPlay: boolean;
}

export type ViewMode = 'channels' | 'favourites' | 'epg' | 'settings';
