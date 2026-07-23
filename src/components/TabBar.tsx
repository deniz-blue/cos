import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { CommonActions } from "expo-router/react-navigation";
import { startTransition } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";
import { Box } from "./base/Box";
import { ButtonBase } from "./base/ButtonBase";
import { Text } from "./base/Text";

export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
	const insets = useSafeAreaInsets();

	return (
		<Box
			direction="row"
			role="tablist"
			bg={Colors.Dark8}
			py="xs"
			px="sm"
			style={{
				paddingBottom: insets.bottom,
				borderTopWidth: 1,
				borderTopColor: Colors.Dark5,
			}}
		>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key]!;
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (event.defaultPrevented) return;

					startTransition(() => {
						navigation.dispatch({
							...CommonActions.navigate(route.name, route.params),
							target: state.key,
						});
					});
				};

				const color = isFocused ? Colors.Primary : Colors.TextDimmed;

				return (
					<ButtonBase
						key={route.key}
						onPress={onPress}
						style={{ flex: 1, alignItems: "center", gap: 2 }}
						role="tab"
						accessibilityState={{
							selected: isFocused,
						}}
					>
						<Box py="sm" align="center">
							{options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
							<Text fz={11} c={color}>
								{options.title ?? route.name}
							</Text>
						</Box>
					</ButtonBase>
				);
			})}
		</Box>
	);
};
