import { api } from "@/api/api";
import { queryOptions } from "@tanstack/react-query";
import { messagesSchema, unreadChatsSchema } from "../schemas/message-schema";
import { chatMessagesKeys, unreadChatsKeys } from "@/shared/constants/query-keys";

export const chatUnreadMessagesCountOptions = queryOptions({
  queryKey: unreadChatsKeys.all,
  queryFn: async () => api.get("/notifications/unread", unreadChatsSchema),
  staleTime: 1000 * 60
});

export const chatMessages = (chatId: number) => queryOptions({
  queryKey: chatMessagesKeys.detail(chatId),
  queryFn: async () => api.get(`/chat/${chatId}`, messagesSchema),
  staleTime: 1000 * 60 * 5,
  enabled: !!chatId
});
