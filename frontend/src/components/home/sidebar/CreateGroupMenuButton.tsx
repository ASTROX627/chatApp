import { Pencil } from "lucide-react"
import type { FC, JSX } from "react"
import { useTheme } from "../../../hooks/useTheme"
import { useAppContext } from "../../../context/app/appContext"

const CreateGroupMenuButton: FC = (): JSX.Element => {
  const { setShowCreateGroupMenu, isActiveCreateGroupButton } = useAppContext();
  const { classes } = useTheme();
  return (
    <div
      onClick={setShowCreateGroupMenu}
      className={`p-3 cursor-pointer ${classes.primary.hover.bg} ${isActiveCreateGroupButton ? classes.primary.bg : ""}`}>
      <Pencil size={30} />
    </div>
  )
}

export default CreateGroupMenuButton