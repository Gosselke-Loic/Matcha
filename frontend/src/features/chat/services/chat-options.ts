import { api } from "@/api/api";
import { queryOptions } from "@tanstack/react-query";
import { messagesSchema, unreadMessagesCountSchema } from "../schemas/message-schema";
import { chatMessagesKeys, unreadMessagesCountKeys } from "@/shared/constants/query-keys";

export const chatUnreadMessagesCountOptions = queryOptions({
  queryKey: unreadMessagesCountKeys.all,
  queryFn: async () => api.get("/notifications/unread", unreadMessagesCountSchema),
  staleTime: 1000 * 60
});

export const chatMessages = (chatId: number) => queryOptions({
  queryKey: chatMessagesKeys.detail(chatId),
  queryFn: async () => api.get(`/chat/${chatId}`, messagesSchema),
  enabled: !!chatId
});
