import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query"; 

import { socket } from "../libs/socket";
import { useUIStore } from "../stores/useUIStore";
import { messageSchema } from "@/features/chat/schemas/message-schema";

// socket.on() here only for global notifications
export const useSocketSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    socket.on("new_message", (rawData) => {
      const activeChatId = useUIStore.getState().activeChatId;

      const result = messageSchema.safeParse(rawData);
      if (!result.success) {
        // options ->
        // ignore message
        // toast and ignore
        // throw and stop application
        return ;
      };

      const msg = result.data;
      if (msg.chatId === activeChatId) {
        // update navbar icon with unread message
      };

      // setQueryData to manually update messages before staleTime 
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
