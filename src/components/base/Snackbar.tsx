import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/sizing";
import { Box } from "./Box";
import { ButtonBase } from "./ButtonBase";
import { Text } from "./Text";

export interface SnackbarProps {
	visible: boolean;
	children: ReactNode;
	onDismiss: () => void;
	duration?: number;
	action?: { label: string; onPress: () => void };
	/** Offset from the bottom of the screen. Defaults to 16. */
	bottom?: number;
}

export const Snackbar = ({
	visible,
	children,
	onDismiss,
	duration = 4000,
	action,
	bottom = 16,
}: SnackbarProps) => {
	const opacity = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(50)).current;

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
			]).start();

			const timer = setTimeout(() => {
				Animated.parallel([
					Animated.timing(opacity, {
						toValue: 0,
						duration: 200,
						useNativeDriver: true,
					}),
					Animated.timing(translateY, {
						toValue: 50,
						duration: 200,
						useNativeDriver: true,
					}),
				]).start(() => onDismiss());
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [visible, duration, onDismiss, opacity, translateY]);

	if (!visible) return null;

	return (
		<Box pos="absolute" bottom={bottom} left={16} right={16} style={{ zIndex: 9999 }}>
			<Animated.View
				style={{
					opacity,
					transform: [{ translateY }],
				}}
			>
				<ButtonBase onPress={onDismiss}>
					<Box
						direction="row"
						align="center"
						justify="space-between"
						bg="#000000CC"
						radius={Radius.Default}
						px="md"
						py="sm"
						gap="sm"
						style={{
							elevation: 6,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 3 },
							shadowOpacity: 0.3,
							shadowRadius: 4,
						}}
					>
						<Box flex={1}>
							{typeof children === "string" ? (
								<Text fz={14} c={Colors.Text}>
									{children}
								</Text>
							) : (
								children
							)}
						</Box>
						{action && (
							<ButtonBase onPress={action.onPress}>
								<Text fz={14} fw="bold" c={Colors.Primary}>
									{action.label}
								</Text>
							</ButtonBase>
						)}
					</Box>
				</ButtonBase>
			</Animated.View>
		</Box>
	);
};
