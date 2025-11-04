import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface FanceProps {
  size?: number;
  fill?: string;
}

export default function Fance({ size = 24, fill = "#000" }: FanceProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M24,9v-2h-1V3.086L20,.086l-3,3v3.914h-2V3.086L12,.086l-3,3v3.914h-2V3.086L4,.086,1,3.086v3.914H0v2H1v7H0v2H1v6H7v-6h2v6h6v-6h2v6h6v-6h1v-2h-1v-7h1Zm-5-5.086l1-1,1,1v3.086h-2V3.914Zm-8,0l1-1,1,1v3.086h-2V3.914Zm2,5.086v7h-2v-7h2ZM3,3.914l1-1,1,1v3.086H3V3.914Zm0,5.086h2v7H3v-7Zm2,13H3v-4h2v4Zm2-6v-7h2v7h-2Zm6,6h-2v-4h2v4Zm2-6v-7h2v7h-2Zm6,6h-2v-4h2v4Zm0-6h-2v-7h2v7Z"
        fill={fill}
      />
    </Svg>
  );
}
