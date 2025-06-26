import type * as React from "react";
import Svg, { Path, type SvgProps } from "react-native-svg";

const TransnistriaFlag: React.FC<SvgProps> = (props) => {
	return (
		<Svg height={700} width={1400} viewBox="0 0 16 8" {...props}>
			<Path fill="#DE0000" d="M0 0H16V8H0z" />
			<Path fill="#093" d="M0 3H16V5H0z" />
		</Svg>
	);
};

export { TransnistriaFlag };
