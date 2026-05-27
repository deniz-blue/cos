import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator, Button, Card, ProgressBar, Snackbar, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { Box, Flex } from "../components/layouting";
import { parsePayload, Payload } from "../lib/payload";
import { useListMutation } from "../lib/useListMutation";

export const useScanner = () => {
	const mut = useListMutation();
	const [error, setError] = useState<string | null>(null);
	const [messages, setMessages] = useState<{
		id: number;
		payload: Payload;
	}[]>([]);

	const TIMEOUT = 3000;
	const createMessage = (message: typeof messages[0]) => {
		setMessages(m => [...m, message]);
		setTimeout(() => {
			setMessages(m => m.filter(m => m.id !== message.id));
		}, TIMEOUT);
	};

	// useEffect(() => createMessage({ id: Date.now(), payload: { name: "John Doe", socials: { t: "johndoe" }, details: "e" } }), []);

	const handleScan = async (res: BarcodeScanningResult) => {
		try {
			const data = parsePayload(res.data);
			console.log("Scanned data:", data);
			const id = await mut.mutateAsync({ type: "add", item: { payload: data, note: "" } });
			if (!id) return;
			console.log("Added to list with ID:", id);
			createMessage({ id, payload: data });
		} catch (e) {
			console.log("Failed to parse QR code data", e);
			setError("Failed to parse QR code data");
			return;
		}
	};

	const dismissMessage = (id: number) => {
		setMessages(messages => messages.filter(m => m.id !== id));
	};

	return {
		handleScan,
		error,
		setError,
		messages,
		dismissMessage,
	};
};

export default function CameraScreen() {
	const theme = useTheme();
	const router = useRouter();
	const { handleScan, error, setError, messages, dismissMessage } = useScanner();
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => void (async () => {
		const { status } = await Camera.requestCameraPermissionsAsync();
		setHasPermission(status === 'granted');
	})(), []);

	if (hasPermission === null) return (
		<Flex direction="column" align="center" justify="center" w="100%" h="100%">
			<ActivityIndicator size="large" />
			<Text>
				Requesting camera permissions...
			</Text>
		</Flex>
	);

	if (hasPermission === false) return (
		<Flex direction="column" align="center" justify="center" w="100%" h="100%" gap="md">
			<Text variant="titleMedium">
				Camera access denied
			</Text>
			<Text variant="bodyMedium" style={{ color: "#666", textAlign: "center" }}>
				Can't access camera to scan QR codes!
			</Text>
			<Button
				mode="contained"
				onPress={() => {
					Camera.requestCameraPermissionsAsync().then(({ status }) => {
						setHasPermission(status === "granted");
					});
				}}
			>
				Retry
			</Button>
		</Flex>
	);

	return (
		<Flex w="100%" h="100%" align="center" justify="center">
			<CameraView
				onBarcodeScanned={handleScan}
				barcodeScannerSettings={{
					barcodeTypes: ["qr"],
				}}
				facing="back"
				style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
			/>

			<Box style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} pointerEvents="none">
				<ProgressBar
					indeterminate
				/>
			</Box>

			<Snackbar
				visible={!!error}
				onDismiss={() => setError(null)}
				duration={2000}
			>
				{error}
			</Snackbar>

			<Flex
				pos="absolute"
				w="100%"
				h="100%"
				p="xs"
				justify="flex-end"
				align="center"
				pb="md"
			>
				<Box>
					<Button
						mode="contained"
						icon="arrow-left"
						onPress={() => router.replace("/")}
					>
						Back
					</Button>
				</Box>
			</Flex>

			<Flex
				pos="absolute"
				w="100%"
				h="100%"
				p="xs"
				justify="flex-end"
				style={{ pointerEvents: "none" }}
			>
				<Box>
					<ScrollView
						contentContainerStyle={{ gap: 8 }}
						showsVerticalScrollIndicator={false}
					>
						<Flex direction="column" gap="xs">
							{messages.map(message => (
								<Animated.View
									key={message.id}
									entering={FadeInDown.duration(300)}
									exiting={FadeOutDown.duration(250)}
									layout={LinearTransition.springify().mass(0.4)}
								>
									<Card
										mode="elevated"
										onPress={() => dismissMessage(message.id)}
									>
										<Card.Content
											style={{
												padding: 0,
											}}
										>
											<Flex direction="row" align="center" justify="space-between" p="xs" px="md">
												<Flex direction="row" gap="xs" align="center">
													<MaterialDesignIcons name="check" size={24} color={theme.colors.primary} />
													<Text>
														{message.payload.name}
													</Text>
												</Flex>
												{/* <Button
										>
										Add Note
										</Button> */}
											</Flex>
										</Card.Content>
									</Card>
								</Animated.View>
							))}
						</Flex>
					</ScrollView>
				</Box>
			</Flex>
		</Flex>
	);
};
