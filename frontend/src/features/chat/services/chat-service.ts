import { z } from "zod";

import { socket } from "@/shared/libs/socket"; 

const sendMessageSchema = z.object({
  chatId: z.number().int().positive(),
  text: z.string()
});
type SendMessageData = z.infer<typeof sendMessageSchema>;

export const chatApi = {
  sendMessage: (data: SendMessageData): Promise<void> => {
    return new Promise((resolve) => {
      socket.emit("send_message", data);
      resolve();
    });
  },
  markAsRead: (chatId: number): Promise<void> => {
    return new Promise((resolve) => {
      socket.emit("mark_as_read", { id: chatId });
      resolve();
    });
  }
};
