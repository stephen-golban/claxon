import type * as React from "react";
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient, type SvgProps } from "react-native-svg";

interface CarIconProps extends SvgProps {
  size?: number;
  gradientColors?: string[];
}

const CarIcon: React.FC<CarIconProps> = ({ color = "#000", size = 513, gradientColors, ...props }) => {
  const gradientId = `carGradient-${Math.random().toString(36).substring(2, 11)}`;
  const fillColor = gradientColors ? `url(#${gradientId})` : color;

  return (
    <Svg fill="none" height={size} viewBox="0 0 513 513" width={size} {...props}>
      {gradientColors && (
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientColors.map((gradientColor, index) => (
              <Stop
                key={gradientColor}
                offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                stopColor={gradientColor}
              />
            ))}
          </SvgLinearGradient>
        </Defs>
      )}
      <Path
        d="M488.565 224.623c-3-5-32.61-17.79-32.61-17.79 5.15-2.66 8.67-3.21 8.67-14.21 0-12-.06-16-8.06-16h-27.14c-.11-.24-.23-.49-.34-.74-17.52-38.26-19.87-47.93-46-60.95-35.05-17.43-100.76-18.31-126.52-18.31s-91.47.88-126.49 18.31c-26.16 13-25.51 19.69-46 60.95 0 .11-.21.4-.4.74h-27.17c-7.94 0-8 4-8 16 0 11 3.52 11.55 8.67 14.21 0 0-28.61 13.79-32.61 17.79s-8 32-8 80 4 96 4 96h11.94c0 14 2.06 16 8.06 16h80c6 0 8-2 8-16h256c0 14 2 16 8 16h82c4 0 6-3 6-16h12s4-49 4-96-5-75-8-80zm-362.74 44.94a516.824 516.824 0 01-54.84 3.06c-20.42 0-21.12 1.31-22.56-11.44a72.162 72.162 0 01.51-17.51l.63-3.05h3c12 0 23.27.51 44.55 6.78a97.998 97.998 0 0130.09 15.06c4.36 3.16 5.36 6.16 5.36 6.16zm247.16 72l-4.42 11.06h-224s.39-.61-5-11.18c-4-7.82 1-12.82 8.91-15.66 15.32-5.52 60.09-21.16 108.09-21.16s93.66 13.48 108.5 21.16c5.5 2.84 12.33 4.84 7.92 15.84zm-257-136.53c-3.23.186-6.467.21-9.7.07 2.61-4.64 4.06-9.81 6.61-15.21 8-17 17.15-36.24 33.44-44.35 23.54-11.72 72.33-17 110.23-17s86.69 5.24 110.23 17c16.29 8.11 25.4 27.36 33.44 44.35 2.57 5.45 4 10.66 6.68 15.33-2 .11-4.3 0-9.79-.19zm347.72 56.11c-2.14 12.48-.14 11.48-21.56 11.48a516.85 516.85 0 01-54.84-3.06c-2.85-.51-3.66-5.32-1.38-7.1a93.844 93.844 0 0130.09-15.06c21.28-6.27 33.26-7.11 45.09-6.69a3.22 3.22 0 013.09 3 70.125 70.125 0 01-.49 17.47z"
        fill={fillColor}
      />
    </Svg>
  );
};

export { CarIcon };
