import type React from "react";
import Svg, { G, Path, type SvgProps } from "react-native-svg";

const SwipeLeftIcon: React.FC<SvgProps & { size?: number }> = ({ color = "#000", size = 30, ...props }) => {
  return (
    <Svg height={size} viewBox="0 0 30 30" width={size} {...props}>
      <G fill={color} fillRule="evenodd">
        <Path
          d="M7.658 14.236C6.655 15.152 6 16.296 6 17.52v1.49c0 1.655 1.77 4.376 2.077 4.87.5.809 1.34 2.021 2.027 2.925.168.221.482.26.7.091s.26-.48.092-.7a54.238 54.238 0 01-1.973-2.849C8.625 22.875 7 20.32 7 19.01V17.52c0-.898.496-1.762 1.342-2.554.15-.14.4-.348.658-.543l.002 3.077c0 .28.228.5.498.5.28 0 .502-.173.502-.5V6a1 1 0 112 0v8.5a.5.5 0 101 0V12a1 1 0 112 0v2.5a.5.5 0 101 0V13a1 1 0 112 0v2.5a.5.5 0 101 0V14a1 1 0 112 0v3.5c0 3.275-2 6.395-2 9a.5.5 0 101 0c0-2.244 2-5.713 2-9V14a2 2 0 00-3.112-1.662 2 2 0 00-3-1 2 2 0 00-2.888-1.07V6a2 2 0 10-4 0v7.21c-.494.298-.99.703-1.344 1.026z"
          transform="translate(-90 -450) translate(91 451) rotate(-36 13.998 15.494)"
        />
        <Path
          d="M15.646 5.646a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L13.5 6.793V-3a.5.5 0 111 0v9.796z"
          transform="translate(-90 -450) translate(91 451) rotate(90 14 2.5)"
        />
      </G>
    </Svg>
  );
};

export { SwipeLeftIcon };
