import type { ReactNode } from "react";
import { type ViewStyle } from "react-native";
import { Colors, getThemeColor } from "../../theme/colors";
import { Box, type BoxProps } from "./Box";
import { ButtonBase } from "./ButtonBase";
import { Text } from "./Text";

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

	return (
		<ButtonBase onPress={onPress}>
			<Box
				pos="absolute"
				right={16}
				bottom={16}
				h={56}
				radius={16}
				bg={bg}
				direction="row"
				align="center"
				px="md"
				style={[shadow, style]}
				{...rest}
			>
				{icon}
				<Text fz={14} fw="bold" c={Colors.White} style={{ marginLeft: 8 }}>
					{label}
				</Text>
			</Box>
		</ButtonBase>
	);
};
