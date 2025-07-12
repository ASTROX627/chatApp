import { useEffect } from "react";
import { THEME_CONFIGS } from "../configs/theme/themConfig";
import { useAppContext } from "../context/app/appContext"

export const useThemeCSS = () => {
  const { theme } = useAppContext();
  const config = THEME_CONFIGS[theme];

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-primary", config.primaryColor);
    document.documentElement.style.setProperty("--theme-secondary", config.secondaryColor);
  }, [config.primaryColor, config.secondaryColor]);

  return {
    theme,
    config,
    className: {
      primaryBg: 'bg-[var(--theme-primary)]',
      primaryText: 'text-[var(--theme-primary)]',
      primaryBorder: 'border-[var(--theme-primary)]',
      secondaryBg: 'bg-[var(--theme-secondary)]',
      secondaryText: 'text-[var(--theme-secondary)]',
      secondaryBorder: 'border-[var(--theme-secondary)]'
    }
  }
}