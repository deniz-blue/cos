import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { DarkTheme, ThemeProvider } from "expo-router/react-navigation";
import { useEffect } from "react";
import { Platform } from "react-native";
import {
	MD3DarkTheme,
	PaperProvider
} from "react-native-paper";
import { Box, Flex } from "../components/layouting";
import { database } from "../lib/db";
import { queryClient } from "../lib/query-client";

export default function RootLayout() {
	useEffect(() => {
		// Preload the database to avoid jank on first access
		(async () => {
			await database();
			console.log("Database initialized");
			console.log("pragma journal_mode", await (await database()).execAsync("PRAGMA journal_mode;"));
		})();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider theme={{
				...MD3DarkTheme,
				roundness: 8,
			}}>
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