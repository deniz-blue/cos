import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { DarkTheme, ThemeProvider } from "expo-router/react-navigation";
import { Platform } from "react-native";
import { Box } from "../components/base/Box";
import { Colors } from "../theme/colors";
import { queryClient } from "../lib/query-client";

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={DarkTheme}>
				<Box
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						...Platform.select({
							web: {
								backgroundColor: "#121212",
							},
							default: {
								backgroundColor: Colors.Background,
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
									backgroundColor: Colors.Background,
									overflow: "hidden",
								},
							}),
						}}
					>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(tabs)" />
						</Stack>
					</Box>
				</Box>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
