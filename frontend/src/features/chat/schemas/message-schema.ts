import { z } from "zod";

export const messageSchema = z.object({
  id: z.number().int().positive(),
  chatId: z.number().int().positive(),
  text: z.string(),
  senderId: z.number().int().positive(),
  createdAt: z.coerce.date()
});
export type MessageData = z.infer<typeof messageSchema>;

export const messagesSchema = z.object({
  id: z.number().int().positive(),
  messages: z.array(messageSchema)
});
export type MessagesData = z.infer<typeof messagesSchema>;

export const unreadChatsSchema = z.object({
  chatIds: z.array(z.number().int().positive())
});
export type unreadChatsData = z.infer<typeof unreadChatsSchema>;
