import Color from 'color';

export const lightenBy = (colorStr, ratio) => {
  const color = Color(colorStr);
  const lightness = color.lightness();
  return color.lightness(lightness + (100 - lightness) * ratio);
};

export const darkenBy = (colorStr, ratio) => {
  const color = Color(colorStr);
  const lightness = color.lightness();
  return color.lightness(lightness - lightness * ratio);
};
