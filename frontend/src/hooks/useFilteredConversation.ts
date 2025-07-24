import { useMemo, useRef } from "react";
import { getRandomEmoji } from "../utils/emojis";
import useGetConversations from "./useGetConversations";
import useGetPublicGroups from "./useGetPublicGroups";
import useGetUserGroups from "./useGetUserGroups";
import type { AllConversations, ConversationType, GroupType } from "../types/conversations";

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

  const emojiCache = useRef<Map<string, string>>(new Map());

  const getStableEmoji = (id: string, type: string) => {
    const cacheKey = `${type}-${id}`;
    if (!emojiCache.current.has(cacheKey)) {
      emojiCache.current.set(cacheKey, getRandomEmoji());
    }
    return emojiCache.current.get(cacheKey)!;
  };

  const userMemberConversations = useMemo<AllConversations[]>(() => {
    const conversationsWithEmojis = conversations.map((conversation: ConversationType) => ({
      ...conversation,
      emoji: getStableEmoji(conversation._id, "user"),
      type: "user" as const
    }));

    const userGroupsWithEmojis = userGroups.map((group: GroupType) => ({
      ...group,
      emoji: getStableEmoji(group._id, "group"),
      type: "group" as const
    }));

    return [...conversationsWithEmojis, ...userGroupsWithEmojis];
  }, [conversations, userGroups]);


  const publicGroupsForSearch = useMemo<AllConversations[]>(() => {
    const nonMemberPublicGroups = publicGroups.filter(publicGroup => !userGroups.some(userGroup => userGroup._id === publicGroup._id));

    return nonMemberPublicGroups.map((group: GroupType) => ({
      ...group,
      emoji: getStableEmoji(group._id, "public-group"),
      type: "group" as const
    }));
  }, [publicGroups, userGroups]);


  const allConversationsForSearch = useMemo<AllConversations[]>(() => {
    return [...userMemberConversations, ...publicGroupsForSearch];
  }, [userMemberConversations, publicGroupsForSearch]);


  const filterByCategory = useMemo(() => {
    if (selectedCategory === CATEGORY_TYPES.ALL) {
      return userMemberConversations;
    }

    return userMemberConversations.filter((conversation: AllConversations) => {
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
  }, [userMemberConversations, selectedCategory]);

  const filterBySearch = useMemo(() => {
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) return userMemberConversations;

    const lowerSearchTerm = trimmedSearchTerm.toLowerCase();

    return allConversationsForSearch.filter((item: AllConversations) => {
      const name = item.type === "user"
        ? (item as ConversationType).username
        : (item as GroupType).groupName;

      return name.toLowerCase().includes(lowerSearchTerm);
    });
  }, [allConversationsForSearch, searchTerm, userMemberConversations]);

  const filteredConversations = useMemo(() => {
    return searchTerm.trim() ? filterBySearch : filterByCategory;
  }, [searchTerm, filterBySearch, filterByCategory]);

  const isLoading = useMemo(
    () => usersLoading || userGroupsLoading || publicGroupsLoading,
    [usersLoading, userGroupsLoading, publicGroupsLoading]
  );

  return {
    allConversations: userMemberConversations,
    filteredConversations,
    isLoading,
    hasSearchTerm: Boolean(searchTerm.trim()),
    isEmpty: filteredConversations.length === 0,
    hasNoConversations: userMemberConversations.length === 0
  };
};