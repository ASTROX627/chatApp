import type { FC, JSX } from "react"
import { twMerge } from "tailwind-merge"
import { useTheme } from "../../../hooks/useTheme"

type MenuButtonProps = {
  onClick: () => void,
  isActive: boolean,
  icon: JSX.Element,
  label: string
}

const MenuButton: FC<MenuButtonProps> = ({ onClick, isActive, icon, label }) => {
  const { classes } = useTheme();
  return (
    <button
      onClick={onClick}
      className={twMerge("p-3 cursor-pointer transition-all duration-200 border-b-1 border-gray-500 flex items-center justify-start gap-2 whitespace-nowrap lg:justify-center lg:flex-col lg:gap-1 lg:text-xs", isActive ? classes.primary.bg : "", classes.primary.hover.bg)}
    >
      <div className="w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="lg:hidden">{label}</h2>
    </button>
  )
}

export default MenuButton