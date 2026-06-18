import { CommonActions } from "expo-router/react-navigation";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./base/Box";
import { Text } from "./base/Text";
import { Colors } from "../theme/colors";

interface TabBarProps {
	state: {
		index: number;
		routeNames: string[];
		key: string;
		routes: { key: string; name: string; params?: Record<string, any> }[];
	};
	descriptors: Record<string, {
		options: {
			title?: string;
			tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
		};
	}>;
	navigation: {
		emit: (...args: any[]) => any;
		dispatch: (action: any) => void;
	};
}

export const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
	const insets = useSafeAreaInsets();

	return (
		<Box
			direction="row"
			bg={Colors.Dark8}
			py="xs"
			px="sm"
			style={{
				paddingBottom: insets.bottom + 4,
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

					if (!event.defaultPrevented) {
						navigation.dispatch({
							...CommonActions.navigate(route.name, route.params),
							target: state.key,
						});
					}
				};

				const color = isFocused ? Colors.Primary : Colors.TextDimmed;

				return (
					<TouchableOpacity
						key={route.key}
						onPress={onPress}
						activeOpacity={0.7}
						style={{ flex: 1, alignItems: "center", gap: 2 }}
					>
						{options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
						<Text fz={11} c={color}>
							{options.title ?? route.name}
						</Text>
					</TouchableOpacity>
				);
			})}
		</Box>
	);
};
