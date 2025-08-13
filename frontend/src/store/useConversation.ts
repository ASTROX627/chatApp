import { create } from "zustand";
import type { ConversationType, GroupMessageType, GroupType, MessageType } from "../types/conversations";
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
  groupMessages: GroupMessageType[];
  setGroupMessages: (groupMessages: GroupMessageType[]) => void;
  previousGroup: GroupType | null;
  setPreviousGroup: (previousGroup: GroupType | null) => void;
  navigationContext: "normal" | "groupProfile" | null;
  setNavigationContext: (navigationContext: 'normal' | 'groupProfile' | null) => void;
  clearSelection: () => void;
  restorePreviousGroup: () => void;
}

const useConversation = create<ConversationStore>((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation, selectedGroup: null }),
  selectedGroup: null,
  setSelectedGroup: (selectedGroup) => set({ selectedGroup, selectedConversation: null }),
  userGroups: [],
  setUserGroups: (userGroups) => set({ userGroups }),
  publicGroups: [],
  setPublicGroups: (publicGroups) => set({ publicGroups }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  groupMessages: [],
  setGroupMessages: (groupMessages) => set({groupMessages}),
  previousGroup: null,
  setPreviousGroup: (previousGroup) => set({previousGroup}),
  navigationContext: null,
  setNavigationContext: (navigationContext) => set({navigationContext}),
  clearSelection: () => set({selectedConversation: null}),
  restorePreviousGroup: () => {
    const { previousGroup } = get();
    if (previousGroup) {
      set({ 
        selectedGroup: previousGroup, 
        selectedConversation: null,
        previousGroup: null,
        navigationContext: null 
      });
    }
  }
}))

export default useConversation;