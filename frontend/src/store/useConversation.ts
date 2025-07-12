import type { ReactNode } from "react";
import { create } from "zustand";

export type MessageType = {
  _id: string,
  senderId: string,
  receiverId: string,
  message: string,
  messageType: "text" | "image" | "file" | "document"
  fileUrl?: string,
  fileName?: string,
  fileSize?: number,
  fileMimeType?: string,
  createdAt: string,
}

export type ConversationType = {
  _id: string,
  username: string
  profilePicture: string,
  emoji: ReactNode
}

interface ConversationStore {
  selectedConversation: ConversationType | null;
  setSelectedConversation: (selectedConversation: ConversationType | null) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void
}

const useConversation = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}))

export default useConversation;