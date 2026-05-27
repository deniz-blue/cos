import Icon from "@react-native-vector-icons/material-design-icons";
import { Tabs } from "expo-router";
import { CommonActions } from "expo-router/react-navigation";
import { BottomNavigation } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
	const insets = useSafeAreaInsets();

	return (
		<Tabs
			screenOptions={{ headerShown: false }}
			tabBar={({ navigation, state, descriptors }) => (
				<BottomNavigation.Bar
					navigationState={state}
					safeAreaInsets={insets}
					onTabPress={({ route, preventDefault }) => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});

						if (event.defaultPrevented) {
							preventDefault();
						} else {
							navigation.dispatch({
								...CommonActions.navigate(route.name, route.params),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, color }) => {
						const { options } = descriptors[route.key];
						return options.tabBarIcon ? options.tabBarIcon({ focused: true, color, size: 24 }) : null;
					}}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						return options.title ?? route.name;
					}}
				/>
			)}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "QR Code",
					tabBarIcon: ({ color, size }) => <Icon name="qrcode-scan" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="list"
				options={{
					title: "List",
					tabBarIcon: ({ color, size }) => <Icon name="format-list-bulleted" color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "My Details",
					tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
				}}
			/>
		</Tabs>
	);
}