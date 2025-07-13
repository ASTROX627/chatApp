import mongoose from "mongoose";

type Member = {
  user: mongoose.Types.ObjectId;
  role: string,
  joinedAt: Date;
}

// GENERATE_INVITE_CODE
export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// IS_USER_ADMIN
export const isUserAdmin = (
  userId: mongoose.Types.ObjectId,
  ownerId: mongoose.Types.ObjectId,
  admins: mongoose.Types.ObjectId[]
): boolean => {
  return (
    ownerId.equals(userId) || admins.some(adminId => adminId.equals(userId))
  )
}

// GET_ALL_ADMINS
export const getAllAdmins = (
  ownerId: mongoose.Types.ObjectId,
  admins: mongoose.Types.ObjectId[],
  mutate: boolean = false
): mongoose.Types.ObjectId[] => {
  const allAdmins = mutate ? admins : [...admins];
  if (!allAdmins.some(adminId => adminId.equals(ownerId))) {
    allAdmins.push(ownerId)
  }
  return allAdmins;
}


// GET_USER_ROLE
export const getUserRole = (
  userId: mongoose.Types.ObjectId,
  ownerId: mongoose.Types.ObjectId,
  members: [{
    user: mongoose.Types.ObjectId;
    role: string;
    joinedAt: Date;
  }]
): "owner" | "admin" | "member" | null => {
  if (ownerId.equals(userId)) {
    return "owner"
  }

  const member = members.find(m => m.user.equals(userId));
  if (!member) {
    return null;
  }

  return member.role as "admin" | "owner"
}

// export const isUserMember = (
//   userId: mongoose.Types.ObjectId,
//   members: Array<{
//     user: mongoose.Types.ObjectId;
//     role: string;
//     joinedAt: Date;
//   }>
// ): boolean => {
//   return members.some(member => member.user.equals(userId));
// };

// GET_NUMBER_OF_MEMBERS

export const getMembersCount = (
  members: Member[],
  ownerId: mongoose.Types.ObjectId,
  admins: mongoose.Types.ObjectId[]
): number => {
  const allAdmins = getAllAdmins(ownerId, admins);
  const adminSet = new Set(admins.map(admin => admin.toString()));
  const uniqueMembers = members.filter(member => !adminSet.has(member.user.toString()));
  const totalMember = allAdmins.length + uniqueMembers.length;
  return totalMember;
}