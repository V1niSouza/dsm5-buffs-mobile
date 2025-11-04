import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
  width?: number;
  height?: number;
  stroke?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ width = 14, height = 15, stroke = '#404040' }) => (
  <Svg width={width} height={height} viewBox="0 0 14 15" fill="none">
    <Path
      d="M1 5.76682C1 5.24874 1.26749 4.76377 1.71548 4.46964L7 1L12.2845 4.46964C12.7325 4.76377 13 5.24874 13 5.76682V12.4242C13 13.2945 12.259 14 11.3448 14H2.65517C1.74105 14 1 13.2945 1 12.4242V5.76682Z"
      stroke={stroke}
      strokeWidth={1.20741}
      strokeLinejoin="round"
    />
    <Path
      d="M5.13793 9.66667C5.13793 9.23153 5.50845 8.87879 5.96552 8.87879H8.03448C8.49155 8.87879 8.86207 9.23153 8.86207 9.66667V14H5.13793V9.66667Z"
      stroke={stroke}
      strokeWidth={1.20741}
      strokeLinejoin="round"
    />
  </Svg>
);

export default HomeIcon;
