import { useRouter } from "expo-router";
import { Dimensions, ScrollView } from "react-native";
import { ActivityIndicator, Button, FAB, Text, useTheme } from "react-native-paper";
import QRCode from "react-qr-code";
import { Box, Flex } from "../../components/layouting";
import { createPayload, isEmptyPayload, serializePayload } from "../../lib/payload";
import { useProfileQuery } from "../../lib/useProfileQuery";

export default function QrPage() {
	const theme = useTheme();
	const router = useRouter();
	const profile = useProfileQuery();

	const qrcode = serializePayload(profile.data ?? createPayload());

	return (
		<ScrollView>
			<Flex direction="column" align="center" justify="center" px="md" py="xl" gap="xl" style={{ minHeight: Dimensions.get("window").height - 64 - 16 }}>
				<Box
					style={{ width: "100%", aspectRatio: 1, position: "relative", borderRadius: theme.roundness }}
				>
					<Box
						p="lg"
						w="100%"
						h="100%"
						style={{ backgroundColor: "#ffffff", borderRadius: theme.roundness }}
					>
						<QRCode
							value={qrcode}
							style={{ width: "100%", height: "100%" }}
						/>
					</Box>
					<Flex
						align="center"
						justify="center"
						w="100%"
						h="100%"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							borderRadius: theme.roundness,
							opacity: profile.isPending ? 1 : 0,
						}}
					>
						<ActivityIndicator size={64} />
					</Flex>
					{profile.data && isEmptyPayload(profile.data) && (
						<Flex
							align="center"
							justify="center"
							w="100%"
							h="100%"
							p="md"
							style={{ position: "absolute", top: 0, left: 0, backgroundColor: theme.colors.surface, borderRadius: theme.roundness }}
						>
							<Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
								You don't have details!
							</Text>
						</Flex>
					)}
				</Box>

				<Flex direction="column" align="center" justify="center" gap="md">
					<Flex gap={0} align="center" justify="center" direction="column">
						<Text variant="titleLarge">
							{profile.data?.name ?? ""}
						</Text>
						<Text variant="titleMedium">
							{profile.data?.details ?? ""}
						</Text>
					</Flex>
					<Button
						mode="contained-tonal"
						icon="pencil"
						onPress={() => router.push("/(tabs)/profile")}
					>
						Edit details
					</Button>
				</Flex>

				<FAB
					icon="qrcode-scan"
					label="Scan QR Code"
					onPress={() => router.push("/camera")}
					style={{ position: "absolute", bottom: 16, right: 16 }}
				/>

				{/* <Button
					mode="contained"
					onPress={() => router.push("/camera")}
					icon="qrcode-scan"
				>
					Scan QR Code
				</Button> */}
			</Flex>
		</ScrollView>
	)
}
