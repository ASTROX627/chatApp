import { type FC } from 'react'
import type { ThemeType } from '../../../../../context/app/appReducer';
import { Check } from 'lucide-react';
import type { ThemeConfig } from '../../../../../configs/theme/themConfig';
import { getColorValues } from '../../../../../configs/theme/getColorValues';
import { useTranslation } from 'react-i18next';

type ThemeCardProps = {
  config: ThemeConfig,
  isActive: boolean,
  onSelect: (theme: ThemeType) => void;
}

const ThemeCard: FC<ThemeCardProps> = ({ config, isActive, onSelect }) => {
  const { primaryColor, image, alt, name } = config;
  const { t } = useTranslation();
  const cardRgb = getColorValues(primaryColor);
  return (
    <div
      onClick={() => onSelect(name)}
      className={`relative border-2 rounded cursor-pointer transition-all duration-200 hover:scale-105 ${isActive ? "ring-2 ring-offset-2 ring-offset-transparent" : ""}`}
      style={{
        borderColor: primaryColor,
        '--card-color': primaryColor,
        '--card-rgb': `${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}`,
        ringColor: isActive ? primaryColor : 'transparent'
      } as React.CSSProperties}
      role='button'
      tabIndex={0}
    >
      <img
        className='w-full h-18 hover:opacity-80 transition-opacity duration-200'
        src={image}
        alt={alt}
        loading='lazy'
      />
      {
        isActive && (
          <div
            className={`absolute rounded-full -right-2 -top-2 p-1`}
            aria-label='Selected theme'
            style={{ backgroundColor: primaryColor }}
          >
            <Check size={16} className='text-white' />
          </div>
        )
      }
      <p
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-medium drop-shadow-sm"
        style={{ color: primaryColor }}
      >
        {t(`home.themes.${name}`)}
      </p>
    </div>
  )
}

export default ThemeCard