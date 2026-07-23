import {
	IconAlertCircle,
	IconArrowLeft,
	IconCheck,
	IconInfoCircle,
	IconPencil,
} from "@tabler/icons-react-native";
import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "../components/base/Box";
import { Button } from "../components/base/button/Button";
import { Card } from "../components/base/Card";
import { Loader } from "../components/base/Loader";
import { ProgressBar } from "../components/base/ProgressBar";
import { Text } from "../components/base/Text";
import { NoteEditModal } from "../components/NoteEditModal";
import type { QueueMessage } from "../lib/use-scanner";
import { useScanner } from "../lib/use-scanner";
import { useListMutation } from "../lib/useListMutation";
import { useListQuery } from "../lib/useListQuery";
import { Colors } from "../theme/colors";
import { FontSize, IconSize } from "../theme/sizing";

const iconForType = (type: QueueMessage["type"]) => {
	switch (type) {
		case "added":
			return <IconCheck size={24} color={Colors.Primary} />;
		case "exists":
			return <IconInfoCircle size={24} color={Colors.Primary} />;
		case "error":
			return <IconAlertCircle size={24} color={Colors.Red} />;
	}
};

const labelForType = (type: QueueMessage["type"]) => {
	switch (type) {
		case "added":
			return "Scanned";
		case "exists":
			return "Exists:";
		case "error":
			return "Error";
	}
};

const messageText = (message: QueueMessage) => {
	if (message.type === "error") return "Invalid QR code";
	return message.payload.name;
};

export default function CameraScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [noteItemId, setNoteItemId] = useState<string | null>(null);
	const listQuery = useListQuery();
	const mut = useListMutation();
	const { messages, handleScan } = useScanner();

	useEffect(
		() =>
			void (async () => {
				const { status } = await Camera.requestCameraPermissionsAsync();
				setHasPermission(status === "granted");
			})(),
		[],
	);

	if (hasPermission === null)
		return (
			<Box direction="column" align="center" justify="center" w="100%" h="100%">
				<Loader size="large" />
				<Text>Requesting camera permissions...</Text>
			</Box>
		);

	if (hasPermission === false)
		return (
			<Box direction="column" align="center" justify="center" w="100%" h="100%" gap="md">
				<Text fz={FontSize.md} fw="bold">
					Camera access denied
				</Text>
				<Text fz={FontSize.sm} c={Colors.TextDimmed} ta="center">
					Can't access camera to scan QR codes!
				</Text>
				<Button
					variant="primary"
					onPress={() => {
						Camera.requestCameraPermissionsAsync().then(({ status }) => {
							setHasPermission(status === "granted");
						});
					}}
				>
					Retry
				</Button>
			</Box>
		);

	return (
		<Box w="100%" h="100%" align="center" justify="center">
			<CameraView
				onBarcodeScanned={handleScan}
				barcodeScannerSettings={{
					barcodeTypes: ["qr"],
				}}
				facing="back"
				style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
				accessible
				accessibilityLabel="QR Code Scanner Active"
			/>

			<Box style={{ position: "absolute", top: 0, left: 0, width: "100%" }} pointerEvents="none">
				<ProgressBar />
			</Box>

			<Box
				pos="absolute"
				w="100%"
				h="100%"
				p="xs"
				pb={0}
				gap="md"
				justify="flex-end"
				align="center"
				style={{ paddingBottom: insets.bottom + 16 }}
			>
				<Box w="100%" pointerEvents="box-none">
					<ScrollView contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
						{messages.map((message) => (
							<Animated.View
								key={message.id}
								entering={FadeInDown.duration(300)}
								exiting={FadeOutDown.duration(250)}
								layout={LinearTransition.springify().mass(0.4)}
							>
								<Card bg="rgba(0,0,0,0.8)">
									<Box direction="row" align="center" justify="space-between" p="xs">
										<Box direction="row" gap="xs" align="center" accessible>
											{iconForType(message.type)}
											<Text fw="bold" c={Colors.TextDimmed}>
												{labelForType(message.type)}
											</Text>
											<Text>{messageText(message)}</Text>
										</Box>
										{message.type !== "error" && (
											<Button
												variant="subtle"
												py={0}
												leftSection={<IconPencil size={IconSize.xs} color={Colors.Primary} />}
												onPress={() => {
													setNoteItemId(message.id);
												}}
												accessibilityLabel="Set Note"
											>
												Note
											</Button>
										)}
									</Box>
								</Card>
							</Animated.View>
						))}
					</ScrollView>
				</Box>
				<Box>
					<Button
						variant="primary"
						leftSection={<IconArrowLeft size={IconSize.lg} color={Colors.White} />}
						onPress={() => router.replace("/")}
					>
						Back
					</Button>
				</Box>
			</Box>

			<NoteEditModal
				visible={noteItemId !== null}
				initialNote={listQuery.data?.find((i) => i.id === noteItemId)?.note ?? ""}
				onSave={(note) => {
					if (noteItemId) {
						mut.mutate({ type: "update", item: { id: noteItemId, note } });
					}
					setNoteItemId(null);
				}}
				onDismiss={() => setNoteItemId(null)}
			/>
		</Box>
	);
}
