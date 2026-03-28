import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatApi } from "../services/chat-service";
import { unreadChatsKeys } from "@/shared/constants/query-keys";
import { type unreadChatsData } from "../schemas/message-schema";

export const useChat = () => {
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: () => { /* Something to do? */ }
  });

  const markAsRead = useMutation({
    mutationFn: chatApi.markAsRead,
    onSuccess: (_, chatId) => {
      queryClient.setQueryData<unreadChatsData>(unreadChatsKeys.all, (old) => {
      if (!old) return (old);

      return ({
         ...old,
         unreadChats: old.chatIds.filter((id) => id !== chatId)
      });
     }); 
    }
  });

  return ({
    send: sendMessage,
    markAsRead: markAsRead
  });
};
