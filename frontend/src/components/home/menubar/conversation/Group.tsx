import type { FC, JSX, ReactNode } from "react"
import { useTheme } from "../../../../hooks/useTheme"
import useConversation from "../../../../store/useConversation"
import type { GroupType } from "../../../../types/conversations"

type GroupProps = {
  group: GroupType,
  emoji: ReactNode,
}

const Group: FC<GroupProps> = ({ group, emoji }): JSX.Element => {
  const { selectedGroup, setSelectedGroup } = useConversation();
  const { classes } = useTheme();
  const isSelected = selectedGroup?._id === group._id;

  return (
    <>
      <div
        onClick={() => setSelectedGroup(group)}
        className={`flex gap-2 items-center justify-center ${classes.primary.hover.bg} rounded px-2 py-1 cursor-pointer ${isSelected ? `${classes.primary.bg}` : ""}`}
      >
        <div className="avatar avatar-online">
          <div className="w-12 rounded-full">
            <img src={group.groupImage} alt="group image" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <p className="font-bold text-gray-200">{group.groupName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>
      <div className="border-b-1 border-gray-500" />
    </>
  )
}

export default Group