import { IconList, IconQrcode, IconUser } from "@tabler/icons-react-native";
import { Tabs } from "expo-router";
import { TabBar } from "../../components/TabBar";

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
			<Tabs.Screen
				name="index"
				options={{
					title: "QR Code",
					tabBarIcon: ({ color, size }) => <IconQrcode aria-hidden size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="list"
				options={{
					title: "History",
					tabBarIcon: ({ color, size }) => <IconList aria-hidden size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => <IconUser aria-hidden size={size} color={color} />,
				}}
			/>
		</Tabs>
	);
}
