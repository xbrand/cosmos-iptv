import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Channel, AppSettings, ViewMode } from '../types';

// ─── Channel store ──────────────────────────────────────────────────────────────

interface ChannelStore {
  channels: Channel[];
  currentChannel: Channel | null;
  isLoading: boolean;
  error: string | null;
  setChannels: (channels: Channel[]) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChannelStore = create<ChannelStore>((set) => ({
  channels: [],
  currentChannel: null,
  isLoading: false,
  error: null,
  setChannels: (channels) => set({ channels, error: null }),
  setCurrentChannel: (currentChannel) => set({ currentChannel }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// ─── Favourites store ───────────────────────────────────────────────────────────

interface FavouriteStore {
  favouriteIds: string[];
  toggleFavourite: (channelId: string) => void;
  isFavourite: (channelId: string) => boolean;
}

export const useFavouriteStore = create<FavouriteStore>()(
  persist(
    (set, get) => ({
      favouriteIds: [],
      toggleFavourite: (channelId) => {
        const { favouriteIds } = get();
        set({
          favouriteIds: favouriteIds.includes(channelId)
            ? favouriteIds.filter((id) => id !== channelId)
            : [...favouriteIds, channelId],
        });
      },
      isFavourite: (channelId) => get().favouriteIds.includes(channelId),
    }),
    { name: 'cosmos-favourites' }
  )
);

// ─── Settings store ────────────────────────────────────────────────────────────

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        m3uUrl: '',
        epgUrl: '',
        autoPlay: true,
      },
      updateSettings: (partial: Partial<AppSettings>) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
    }),
    { name: 'cosmos-settings' }
  )
);

// ─── UI store ───────────────────────────────────────────────────────────────────

interface UIStore {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  isPlayerVisible: boolean;
  setPlayerVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeView: 'channels',
  setActiveView: (activeView) => set({ activeView }),
  isPlayerVisible: false,
  setPlayerVisible: (isPlayerVisible) => set({ isPlayerVisible }),
}));
