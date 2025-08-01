import type { ReactNode } from "react";

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
  messageType: "text" | "image" | "file" | "document" | "link" | "inviteLink",
  fileUrl?: string,
  fileName?: string,
  fileSize?: number,
  fileMimeType?: string,
  inviteData?: InviteLinkData,
  createdAt: string,
}

export type GroupMessageType = {
  _id: string,
  senderId: {
    _id: string,
    username: string,
    profilePicture: string,
  },
  groupId: string,
  message: string,
  messageType: "text" | "image" | "file" | "document" | "link" | "inviteLink",
  fileUrl?: string,
  fileName?: string,
  fileSize?: number,
  fileMimeType?: string,
  systemMessageType?: string,
  inviteData?: InviteLinkData,
  createdAt: string,
}

export type ConversationType = {
  _id: string,
  fullName: string,
  username: string,
  profilePicture: string,
  emoji: ReactNode
  type: "user",
  groups: GroupType[],
  commonGroups: GroupType[]
}

export type AllConversations = ConversationType | (GroupType & {
  emoji: ReactNode,
  type: "group"
})

export type InviteLinkData = {
  groupId: string,
  groupName: string,
  groupImage: string,
  groupType: "channel" | "group",
  inviteCode: string,
  inviteUrl: string
}