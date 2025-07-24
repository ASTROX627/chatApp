import { useAppContext } from "../context/app/appContext"
import { THEME_CONFIGS } from "../configs/theme/themConfig";
import { useMemo, type CSSProperties } from "react";
import { getColorValues } from "../configs/theme/getColorValues";

export const useTheme = () => {
  const { theme } = useAppContext();

  const themeData = useMemo(() => {
    const config = THEME_CONFIGS[theme];
    const primaryRgb = getColorValues(config.primaryColor);
    const secondaryRgb = getColorValues(config.secondaryColor);
    return {
      theme,
      config,
      styles: {
        "--theme-primary": config.primaryColor,
        "--theme-secondary": config.secondaryColor,
        "--theme-primary-rgb": `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`,
        "--theme-secondary-rgb": `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`,
      } as CSSProperties,

      classes: {
        primary: {
          bg: 'bg-[rgb(var(--theme-primary-rgb))]',
          text: 'text-[rgb(var(--theme-primary-rgb))]',
          border: 'border-[rgb(var(--theme-primary-rgb))]',
          outline: 'outline-[rgb(var(--theme-primary-rgb))]',
          hover: {
            bg: 'hover:bg-[rgb(var(--theme-primary-rgb))]',
            text: 'hover:text-[rgb(var(--theme-primary-rgb))]',
            border: 'hover:border-[rgb(var(--theme-primary-rgb))]',
            outline: 'hover:border-[rgb(var(--theme-primary-rgb))]',
          },
          checked: {
            bg: 'checked:bg-[rgb(var(--theme-primary-rgb))]',
            text: 'checked:text-[rgb(var(--theme-primary-rgb))]',
          }
        },
        secondary: {
          bg: 'bg-[rgb(var(--theme-secondary-rgb))]',
          text: 'text-[rgb(var(--theme-secondary-rgb))]',
          border: 'border-[rgb(var(--theme-secondary-rgb))]',
          outline: 'outline-[rgb(var(--theme-secondary-rgb))]',
          hover: {
            bg: 'hover:bg-[rgb(var(--theme-secondary-rgb))]',
            text: 'hover:text-[rgb(var(--theme-secondary-rgb))]',
            border: 'hover:border-[rgb(var(--theme-secondary-rgb))]',
            outline: 'hover:border-[rgb(var(--theme-secondary-rgb))]',
          },
          checked: {
            bg: 'checked:bg-[rgb(var(--theme-secondary-rgb))]',
            text: 'checked:text-[rgb(var(--theme-secondary-rgb))]',
          }
        },
      }
    }
  }, [theme])

  return themeData;
}