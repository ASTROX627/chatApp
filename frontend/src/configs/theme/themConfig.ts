import type { ThemeType } from "../../context/app/appReducer";

export interface ThemeConfig {
  name: ThemeType;
  image: string;
  alt: string;
  primaryColor: string;
  secondaryColor: string
}

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  sky: {
    name: "sky",
    image: "/images/sky.jpg",
    alt: "sky background",
    primaryColor: "#9333ea",
    secondaryColor: "#c4b5fd"

  },
  spring: {
    name: "spring",
    image: "/images/spring.jpg",
    alt: "spring background",
    primaryColor: "#fde047",
    secondaryColor: "#fef3c7"
  },
  fall: {
    name: "fall",
    image: "/images/fall.jpg",
    alt: "fall background",
    primaryColor: "#ea580c",
    secondaryColor: "#fed7aa",
  },
  winter: {
    name: "winter",
    image: "/images/winter.jpg",
    alt: "winter background",
    primaryColor: "#2563eb",
    secondaryColor: "#bfdbfe"
  },
};