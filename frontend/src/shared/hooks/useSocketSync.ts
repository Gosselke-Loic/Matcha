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
          if (!old) return ({ chatIds: [msg.chatId] });

          if (old.chatIds.includes(msg.chatId)) return (old);

          return ({
            ...old,
            chatIds: [...old.chatIds, msg.chatId]
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
      // setQuerydata and add to cache manually
      //toast
    });

    socket.on("profile_viewed", () => {
      // setQuerydata and add to cache manually
      // toast
    });

    socket.on("new_unlike", () => {
      // setQuerydata and add to cache manually
      // toast
    });

    socket.on("user_status_change", () => {
      // setQuerydata to change is a user logged-in or logged-out and refresh chat state, toast to notify "user has returned!"
      // setQuerydata only if the user is on the profile of the user whose status has changed
    });
    
    return (() => {
      socket.off("new_like");
      socket.off("new_match");
      socket.off("new_unlike");
      socket.off("new_message");
      socket.off("view_profile");
      socket.off("user_status_change");
      socket.disconnect();
    });
  }, [queryClient]);
};
