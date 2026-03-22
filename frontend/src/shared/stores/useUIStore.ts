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
      activeChatId: null,
      isChatOpen: false,
      openChat: () => set({ isChatOpen: true }),
      closeChat: () => set({ isChatOpen: false }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setActiveChat: (id) => set({ activeChatId: id })
    }),
    { name: 'ui-storage' }
  )
);
