import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { DarkTheme, ThemeProvider } from "expo-router/react-navigation";
import { Platform } from "react-native";
import {
	MD3DarkTheme,
	PaperProvider
} from "react-native-paper";
import { Box, Flex } from "../components/layouting";
import { queryClient } from "../lib/query-client";

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider
				theme={{
					...MD3DarkTheme,
					roundness: 8,
				}}
				settings={{
					icon: (props) => <MaterialCommunityIcons {...props} />,
				}}
			>
				<ThemeProvider value={DarkTheme}>
					<Flex
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							...Platform.select({
								web: {
									backgroundColor: "#121212",
								},
								default: {
									backgroundColor: DarkTheme.colors.background,
								},
							}),
						}}
					>
						<Box
							style={{
								width: "100%",
								height: "100%",
								...Platform.select({
									web: {
										maxWidth: 480,
										backgroundColor: DarkTheme.colors.background,
										overflow: "hidden",
									}
								})
							}}
						>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(tabs)" />
							</Stack>
						</Box>
					</Flex>
				</ThemeProvider>
			</PaperProvider>
		</QueryClientProvider>
	);
}
