import type { ReactNode } from "react";
import { type ViewStyle } from "react-native";
import { Box, type BoxProps } from "./Box";
import { Button } from "./button/Button";

export interface FabProps extends BoxProps {
	icon?: ReactNode;
	label?: string;
	onPress?: () => void;
}

const shadow: ViewStyle = {
	elevation: 6,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 3 },
	shadowOpacity: 0.3,
	shadowRadius: 4,
};

export const Fab = ({ icon, label, onPress, style, ...rest }: FabProps) => {
	return (
		<Box absoluteFill pointerEvents="box-none" justify="flex-end" p="md">
			<Box direction="row" justify="flex-end">
				<Button
					onPress={onPress}
					radius={16}
					size="xl"
					variant="primary"
					direction="row"
					align="center"
					px="md"
					style={[shadow, style]}
					leftSection={icon}
					{...rest}
				>
					{label}
				</Button>
			</Box>
		</Box>
	);
};
