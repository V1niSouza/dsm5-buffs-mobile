import { useWindowDimensions } from 'react-native';

export const useDimensions = () => {
  const { width, height } = useWindowDimensions();

  // wp: largura percentual da tela
  const wp = (percent: number) => (width * percent) / 100;

  // hp: altura percentual da tela
  const hp = (percent: number) => (height * percent) / 100;

  return { width, height, wp, hp };
};
