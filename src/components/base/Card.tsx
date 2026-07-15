import type { ReactNode } from "react";
import { Colors } from "../../theme/colors";
import { Box, type BoxProps } from "./Box";

export interface CardProps extends BoxProps {
	children: ReactNode;
}

export const Card = ({ children, p = "sm", radius = 8, style, ...rest }: CardProps) => (
	<Box
		radius={radius}
		p={p}
		style={[
			{
				borderWidth: 1,
				borderColor: Colors.Dark4,
			},
			style,
		]}
		{...rest}
	>
		{children}
	</Box>
);
