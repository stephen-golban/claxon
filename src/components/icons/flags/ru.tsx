import type * as React from "react";
import Svg, { Path, type SvgProps } from "react-native-svg";

const RuFlag: React.FC<SvgProps> = (props) => {
	return (
		<Svg viewBox="0 0 9 6" width={900} height={600} {...props}>
			<Path fill="#fff" d="M0 0H9V3H0z" />
			<Path fill="#d52b1e" d="M0 3H9V6H0z" />
			<Path fill="#0039a6" d="M0 2H9V4H0z" />
		</Svg>
	);
};

export { RuFlag };
