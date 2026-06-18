import { IconQrcode, IconList, IconUser } from "@tabler/icons-react-native";
import { Tabs } from "expo-router";
import { TabBar } from "../../components/TabBar";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{ headerShown: false }}
			tabBar={({ navigation, state, descriptors }) => (
				<TabBar navigation={navigation} state={state} descriptors={descriptors} />
			)}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "QR Code",
					tabBarIcon: ({ color, size }) => <IconQrcode size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="list"
				options={{
					title: "List",
					tabBarIcon: ({ color, size }) => <IconList size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "My Details",
					tabBarIcon: ({ color, size }) => <IconUser size={size} color={color} />,
				}}
			/>
		</Tabs>
	);
}
