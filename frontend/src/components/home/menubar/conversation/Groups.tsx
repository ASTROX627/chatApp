import { useMemo, type FC } from 'react'
import useGetUserGroups from '../../../../hooks/useGetUserGroups'
import { useAppContext } from '../../../../context/app/appContext';
import { getRandomEmoji } from '../../../../utils/emojis';
import Group from './Group';
import type { GroupType } from '../../../../types/conversations';

type UserGroupProps = {
  searchTerm: string
}

const Groups: FC<UserGroupProps> = ({ searchTerm }) => {
  const { loading, userGroups } = useGetUserGroups();
  const { setShowMessageContainer } = useAppContext();

  const userGroupWithEmojis = useMemo(() => {
    return userGroups.map((conversation: GroupType) => ({
      ...conversation,
      emoji: getRandomEmoji()
    }))
  }, [userGroups])

  const filteredUserGroups = userGroupWithEmojis.filter((userGroups: GroupType) => (userGroups.groupName.toLowerCase().includes(searchTerm.toLowerCase())))

  return (
    <div onClick={setShowMessageContainer} className="flex flex-col px-5">
      {
        filteredUserGroups.map((userGroup: GroupType) => (
          <Group
            key={userGroup._id}
            group={userGroup}
            emoji={userGroup.emoji}
          />
        ))
      }
      {loading ? <span className="loading loading-spinner mx-auto"></span> : null}
    </div>
  )
}

export default Groups
