import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query"; 

import { socket } from "../libs/socket";
import {
  messageSchema,
  type MessagesData,
  type unreadChatsData
} from "@/features/chat/schemas/message-schema";
import { useUIStore } from "../stores/useUIStore";
import { chatMessagesKeys, unreadChatsKeys } from "../constants/query-keys";

export const useSocketSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    socket.on("new_message", (rawData) => {
      const { activeChatId } = useUIStore.getState();

      const result = messageSchema.safeParse(rawData);
      if (!result.success) { return ; };

      const msg = result.data;
      if (msg.chatId !== activeChatId) {
        queryClient.setQueryData<unreadChatsData>(unreadChatsKeys.all, (old) => {
          if (!old) return ({ unreadChats: [msg.chatId] });

          if (old.unreadChats.includes(msg.chatId)) return (old);

          return ({
            ...old,
            unreadChats: [...old.unreadChats, msg.chatId]
          });
        });
      };

      queryClient.setQueryData<MessagesData>(chatMessagesKeys.detail(msg.chatId), (old) => {
        if (!old) return (old);

        return ({
          ...old,
          messages: [...old.messages, msg]
        });
      });
    });

    socket.on("new_match", () => {
      // toast
      // invalidateQueries match
    });

    socket.on("new_like", () => {
      //toast
      // invalidateQueries likes
    });

    socket.on("view_profile", () => {
      // toast
    });

    socket.on("new_unlike", () => {
      // toast
    });

    return (() => {
      socket.off("new_like");
      socket.off("new_match");
      socket.off("new_unlike");
      socket.off("new_message");
      socket.off("view_profile");
      socket.disconnect();
    });
  }, [queryClient]);
};
