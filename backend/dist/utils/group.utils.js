"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembersCount = exports.getUserRole = exports.getAllAdmins = exports.isUserAdmin = exports.generateInviteCode = void 0;
// GENERATE_INVITE_CODE
const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
exports.generateInviteCode = generateInviteCode;
// IS_USER_ADMIN
const isUserAdmin = (userId, ownerId, admins) => {
    return (ownerId.equals(userId) || admins.some(adminId => adminId.equals(userId)));
};
exports.isUserAdmin = isUserAdmin;
// GET_ALL_ADMINS
const getAllAdmins = (ownerId, admins, mutate = false) => {
    const allAdmins = mutate ? admins : [...admins];
    if (!allAdmins.some(adminId => adminId.equals(ownerId))) {
        allAdmins.push(ownerId);
    }
    return allAdmins;
};
exports.getAllAdmins = getAllAdmins;
// GET_USER_ROLE
const getUserRole = (userId, ownerId, members) => {
    if (ownerId.equals(userId)) {
        return "owner";
    }
    const member = members.find(m => m.user.equals(userId));
    if (!member) {
        return null;
    }
    return member.role;
};
exports.getUserRole = getUserRole;
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
const getMembersCount = (members, ownerId, admins) => {
    const allAdmins = (0, exports.getAllAdmins)(ownerId, admins);
    const adminSet = new Set(admins.map(admin => admin.toString()));
    const uniqueMembers = members.filter(member => !adminSet.has(member.user.toString()));
    const totalMember = allAdmins.length + uniqueMembers.length;
    return totalMember;
};
exports.getMembersCount = getMembersCount;
