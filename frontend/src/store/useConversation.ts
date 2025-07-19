import type { ReactNode } from "react";
import { create } from "zustand";

export type GroupType = {
  emoji: ReactNode;
  _id: string,
  groupName: string,
  groupType: "group" | "channel",
  groupImage: string,
  owner: {
    _id: string,
    username: string,
    profilePicture: string
  },
  admins: {
    _id: string,
    username: string,
    profilePicture: string
  }[],
  members: {
    user: {
      _id: string,
      username: string,
      profilePicture: string
    }
  }[],
  isPrivate: boolean,
  inviteCode: string,
  createdAt: string,
  updatedAt: string
}

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
  type: "user"
}

export type AllConversations = ConversationType | (GroupType & {
  emoji: ReactNode,
  type: "group"
})

interface ConversationStore {
  selectedConversation: ConversationType | null;
  setSelectedConversation: (selectedConversation: ConversationType | null) => void;
  selectedGroup: GroupType | null;
  setSelectedGroup: (selectedGroup: GroupType | null) => void;
  userGroups: GroupType[];
  setUserGroups: (userGroups: GroupType[]) => void;
  publicGroups: GroupType[];
  setPublicGroups: (pulicGroups: GroupType[]) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void
}

const useConversation = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation, selectedGroup: null }),
  selectedGroup: null,
  setSelectedGroup: (selectedGroup) => set({ selectedGroup, selectedConversation: null }),
  userGroups: [],
  setUserGroups: (userGroups) => set(({ userGroups })),
  publicGroups: [],
  setPublicGroups: (publicGroups) => set(({ publicGroups })),
  messages: [],
  setMessages: (messages) => set({ messages }),
}))

export default useConversation;