export const getColorValues = (hex: string) => {
  const colorMap: Record<string, { r: number, g: number, b: number }> = {
    '#9333ea': { r: 147, g: 51, b: 234 },
    '#c4b5fd': { r: 196, g: 181, b: 253 },
    '#fde047': { r: 253, g: 224, b: 71 },
    '#fef3c7': { r: 254, g: 243, b: 199 },
    '#ea580c': { r: 234, g: 88, b: 12 },
    '#fed7aa': { r: 254, g: 215, b: 170 },
    '#2563eb': { r: 37, g: 99, b: 235 },
    '#bfdbfe': { r: 191, g: 219, b: 254 }
  };
  return colorMap[hex] || { r: 107, g: 114, b: 128 };
}