import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  activeChatId: number | null;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setActiveChat: (id: number) => void;
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isChatOpen: false,
      activeChatId: null,
      openChat: () => set({ isChatOpen: true }),
      closeChat: () => set({ isChatOpen: false }),
      setActiveChat: (id) => set({ activeChatId: id }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen }))
    }),
    { name: 'ui-storage' }
  )
);
