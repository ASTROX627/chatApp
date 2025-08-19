import { useEffect } from "react";
import { useSocketContex } from "../context/socket/socketContext";
import useConversation from "../store/useConversation";
import { useAuthContext } from "../context/auth/authContext";

type UpdatedGroupData = {
  members?: {
    user: {
      _id: string,
      username: string,
      profilePicture: string
    },
    role: string
  }[],
  admins?: {
    _id: string,
    username: string,
    profilePicture: string
  }[],
  memberCount?: number,
};

export const useListenGroupUpdated = () => {
  const { socket } = useSocketContex();
  const { authUser } = useAuthContext();
  const { selectedGroup, setSelectedGroup, userGroups, setUserGroups } = useConversation();

  useEffect(() => {
    socket?.on("groupUpdated", (updateData: UpdatedGroupData) => {
      if (selectedGroup && selectedGroup._id === updateData.members?.[0]?.user._id) {
        const updatedSelectedGroup = {
          ...selectedGroup,
          members: updateData.members || selectedGroup.members,
          admins: updateData.admins || selectedGroup.admins,
          memberCount: updateData.memberCount || selectedGroup.members.length
        };
        setSelectedGroup(updatedSelectedGroup);
      }

      const updatedUserGroups = userGroups.map((group) => {
        if (group._id === selectedGroup?._id) {
          return {
            ...group,
            members: updateData.members || group.members,
            admins: updateData.admins || group.admins,
            memberCount: updateData.memberCount || group.members.length,
          };
        }
        return group;
      });
      setUserGroups(updatedUserGroups);
    });

    socket?.on("kickedFromGroup", ({ groupId }: { groupId: string }) => {
      const updatedUserGroups = userGroups.filter((group) => group._id !== groupId);
      setUserGroups(updatedUserGroups);

      if (selectedGroup?._id === groupId) {
        setSelectedGroup(null);
      }
    });

    socket?.on("roleUpdated", ({ groupId, newRole }: { groupId: string; newRole: string }) => {
      const updatedUserGroups = userGroups.map((group) => {
        if (group._id === groupId) {
          const updatedMembers = group.members.map((member) =>
            member.user._id === authUser?._id ? { ...member, role: newRole } : member
          );
          const updatedAdmins =
            newRole === "admin"
              ? (authUser ? [...group.admins, authUser] : group.admins)
              : group.admins.filter((admin) => admin._id !== authUser?._id);
          return { ...group, members: updatedMembers, admins: updatedAdmins };
        }
        return group;
      });
      setUserGroups(updatedUserGroups);

      if (selectedGroup?._id === groupId) {
        const updatedMembers = selectedGroup.members.map((member) =>
          member.user._id === authUser?._id ? { ...member, role: newRole } : member
        );
        const updatedAdmins =
          newRole === "admin"
            ? (authUser ? [...selectedGroup.admins, authUser] : selectedGroup.admins)
            : selectedGroup.admins.filter((admin) => admin._id !== authUser?._id);


        setSelectedGroup({ ...selectedGroup, members: updatedMembers, admins: updatedAdmins });
      }
    });

    return () => {
      socket?.off("groupUpdated");
      socket?.off("kickedFromGroup");
      socket?.off("roleUpdated")
    };
  }, [authUser, selectedGroup, setSelectedGroup, setUserGroups, socket, userGroups]);
};