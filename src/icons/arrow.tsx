import React from "react";
import Svg, { Path } from "react-native-svg";
// Não é necessário o 'G' pois há apenas um path.

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

// Este ícone parece ser um 'Rotate Left' ou 'Undo'
export default function RotateLeftIcon({ width = 24, height = 24, color = "#000" }: Props) {
  return (
    <Svg
      // Transfere o viewBox do seu SVG original
      viewBox="0 0 24 24" 
      width={width}
      height={height}
      fill="none" // Seu SVG original tinha fill="none"
    >
      {/* O <path> é a única tag a ser mapeada */}
      <Path 
        // Transfere o 'd' do seu SVG original
        d="M20.6622 17C18.9331 19.989 15.7014 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.7014 2 18.9331 4.01099 20.6622 7M12 8L8.00007 12M8.00007 12L12 16M8.00007 12H22" 
        
        // Substitui stroke="black" pelo prop 'color'
        stroke={color} 
        
        // Transfere os outros atributos de estilo
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}