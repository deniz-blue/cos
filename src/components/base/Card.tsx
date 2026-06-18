import type { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { Box, type BoxProps } from "./Box";
import { Colors } from "../../theme/colors";

export interface CardProps extends BoxProps {
	children: ReactNode;
	onPress?: () => void;
}

export const Card = ({
	children,
	onPress,
	p = "sm",
	radius = 8,
	style,
	...rest
}: CardProps) => {
	const content = (
		<Box radius={radius} p={p} style={[
			{
				borderWidth: 1,
				borderColor: Colors.Dark4,
			},
			style,
		]} {...rest}>
			{children}
		</Box>
	);

	if (onPress) {
		return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
	}
	return content;
};
