import { z } from "zod";

export const messageSchema = z.object({
  id: z.number().int().positive(),
  chatId: z.number().int().positive(),
  text: z.string(),
  senderId: z.number().int().positive(),
  // createdAt -> Date
});
export type MessageData = z.infer<typeof messageSchema>;

export const messagesSchema = z.object({
  id: z.number().int().positive(),
  messages: z.array(messageSchema)
});
export type MessagesData = z.infer<typeof messagesSchema>;

export const unreadMessagesCountSchema = z.object({
  count: z.number().int()
});
export type unreadMessagesCountData = z.infer<typeof unreadMessagesCountSchema>;
