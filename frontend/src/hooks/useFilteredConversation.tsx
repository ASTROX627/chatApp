import { useMemo } from "react";
import type { AllConversations, ConversationType, GroupType } from "../store/useConversation";
import { getRandomEmoji } from "../utils/emojis";
import useGetConversations from "./useGetConversations";
import useGetPublicGroups from "./useGetPublicGroups";
import useGetUserGroups from "./useGetUserGroups";

const CATEGORY_TYPES = {
  ALL: "all",
  PRIVATE: "private",
  GROUP: "group", 
  CHANNEL: "channel"
} as const;

type UseConversationsDataProps = {
  searchTerm: string;
  selectedCategory: string;
};

export const useFilteredConversation = ({ searchTerm, selectedCategory }: UseConversationsDataProps) => {
  const { loading: usersLoading, conversations } = useGetConversations();
  const { loading: userGroupsLoading, userGroups } = useGetUserGroups();
  const { loading: publicGroupsLoading, publicGroups } = useGetPublicGroups();

  const allConversations = useMemo<AllConversations[]>(() => {
    const conversationsWithEmojis = conversations.map((conversation: ConversationType) => ({
      ...conversation,
      emoji: getRandomEmoji(),
      type: "user" as const
    }));

    const userGroupsWithEmojis = userGroups.map((group: GroupType) => ({
      ...group,
      emoji: getRandomEmoji(),
      type: "group" as const
    }));

    const nonMemberPublicGroups = publicGroups.filter(publicGroup =>
      !userGroups.some(userGroup => userGroup._id === publicGroup._id)
    );

    const publicGroupsWithEmojis = nonMemberPublicGroups.map((group: GroupType) => ({
      ...group,
      emoji: getRandomEmoji(),
      type: "group" as const
    }));

    return [...conversationsWithEmojis, ...userGroupsWithEmojis, ...publicGroupsWithEmojis];
  }, [conversations, userGroups, publicGroups]);

  const filterByCategory = useMemo(() => {
    if (selectedCategory === CATEGORY_TYPES.ALL) {
      return allConversations;
    }

    return allConversations.filter((conversation: AllConversations) => {
      switch (selectedCategory) {
        case CATEGORY_TYPES.PRIVATE:
          return conversation.type === "user";
        
        case CATEGORY_TYPES.GROUP:
          return conversation.type === "group" && (conversation as GroupType).groupType === "group";
        
        case CATEGORY_TYPES.CHANNEL:
          return conversation.type === "group" && (conversation as GroupType).groupType === "channel";
        
        default:
          return true;
      }
    });
  }, [allConversations, selectedCategory]);

  const filterBySearch = useMemo(() => {
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) return allConversations;

    const lowerSearchTerm = trimmedSearchTerm.toLowerCase();
    
    return allConversations.filter((item: AllConversations) => {
      const name = item.type === "user"
        ? (item as ConversationType).username
        : (item as GroupType).groupName;
      
      return name.toLowerCase().includes(lowerSearchTerm);
    });
  }, [allConversations, searchTerm]);

  const filteredConversations = useMemo(() => {
    return searchTerm.trim() ? filterBySearch : filterByCategory;
  }, [searchTerm, filterBySearch, filterByCategory]);

  const isLoading = useMemo(
    () => usersLoading || userGroupsLoading || publicGroupsLoading,
    [usersLoading, userGroupsLoading, publicGroupsLoading]
  );

  return {
    allConversations,
    filteredConversations,
    isLoading,
    hasSearchTerm: Boolean(searchTerm.trim()),
    isEmpty: filteredConversations.length === 0,
    hasNoConversations: allConversations.length === 0
  };
};