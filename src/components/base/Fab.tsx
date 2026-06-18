import { type ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";
import type { ReactNode } from "react";
import { Box, type BoxProps } from "./Box";
import { Text } from "./Text";
import { Colors, getThemeColor } from "../../theme/colors";

export interface FabProps extends BoxProps {
	icon?: ReactNode;
	label?: string;
	color?: string;
	onPress?: () => void;
}

const shadow: ViewStyle = {
	elevation: 6,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 3 },
	shadowOpacity: 0.3,
	shadowRadius: 4,
};

export const Fab = ({ icon, label, color = "Primary", onPress, style, ...rest }: FabProps) => {
	const bg = getThemeColor(color);

	if (label) {
		return (
			<Box
				component={TouchableOpacity}
				pos="absolute"
				right={16}
				bottom={16}
				h={56}
				radius={16}
				bg={bg}
				direction="row"
				align="center"
				px="md"
				activeOpacity={0.7}
				onPress={onPress}
				style={[shadow, style]}
				{...(rest as any)}
			>
				{icon}
				<Text fz={14} fw="500" c={Colors.White} style={{ marginLeft: 8 }}>{label}</Text>
			</Box>
		);
	}

	return (
		<Box
			component={TouchableOpacity}
			pos="absolute"
			right={16}
			bottom={16}
			w={56}
			h={56}
			radius={28}
			bg={bg}
			align="center"
			justify="center"
			activeOpacity={0.7}
			onPress={onPress}
			style={[shadow, style]}
			{...(rest as any)}
		>
			{icon}
		</Box>
	);
};
