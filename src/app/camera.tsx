import {
	IconAlertCircle,
	IconArrowLeft,
	IconCheck,
	IconInfoCircle,
	IconPencil,
} from "@tabler/icons-react-native";
import { BarcodeScanningResult, Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Vibration } from "react-native";
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "../components/base/Box";
import { Button } from "../components/base/button/Button";
import { ButtonBase } from "../components/base/ButtonBase";
import { Card } from "../components/base/Card";
import { Loader } from "../components/base/Loader";
import { ProgressBar } from "../components/base/ProgressBar";
import { Text } from "../components/base/Text";
import { NoteEditModal } from "../components/NoteEditModal";
import type { QueueMessage } from "../lib/message-queue";
import { useMessageQueue } from "../lib/message-queue";
import { parsePayload } from "../lib/payload";
import { useListMutation } from "../lib/useListMutation";
import { useListQuery } from "../lib/useListQuery";
import { Colors } from "../theme/colors";
import { IconSize } from "../theme/sizing";

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
	if (message.type === "error") return message.text;
	return message.payload.name;
};

export default function CameraScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const queue = useMessageQueue();
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [noteItemId, setNoteItemId] = useState<string | null>(null);
	const listQuery = useListQuery();
	const mut = useListMutation();

	const handleScan = useCallback(
		async (res: BarcodeScanningResult) => {
			try {
				const payload = parsePayload(res.data);
				const result = await mut.mutateAsync({ type: "add", item: { payload, note: "" } });
				return { ...result, payload };
			} catch (e) {
				console.log("Failed to parse QR code data", e);
				return { type: "error" as const };
			}
		},
		[mut],
	);

	const onScan = useCallback(
		async (res: BarcodeScanningResult) => {
			const result = await handleScan(res);

			if (result.type === "added") {
				Vibration.vibrate(50);
				queue.pushScan(result.payload, result.type, result.id);
			} else if (result.type === "exists") {
				queue.pushScan(result.payload, result.type, result.id);
			} else {
				queue.pushError("Failed to parse QR code data");
			}
		},
		[handleScan, queue],
	);

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
				<Text fz={16} fw="500">
					Camera access denied
				</Text>
				<Text fz={14} c={Colors.TextDimmed} ta="center">
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
				onBarcodeScanned={onScan}
				barcodeScannerSettings={{
					barcodeTypes: ["qr"],
				}}
				facing="back"
				style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
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
						{queue.messages.map((message) => (
							<Animated.View
								key={message.id}
								entering={FadeInDown.duration(300)}
								exiting={FadeOutDown.duration(250)}
								layout={LinearTransition.springify().mass(0.4)}
							>
								<ButtonBase onPress={() => queue.dismiss(message.id)}>
									<Card bg="rgba(0,0,0,0.8)">
										<Box direction="row" align="center" justify="space-between" p="xs">
											<Box direction="row" gap="xs" align="center">
												{iconForType(message.type)}
												<Text fw="500" c={Colors.TextDimmed}>
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
														setNoteItemId(message.itemId);
													}}
												>
													Note
												</Button>
											)}
										</Box>
									</Card>
								</ButtonBase>
							</Animated.View>
						))}
					</ScrollView>
				</Box>
				<Box>
					<Button
						variant="primary"
						leftSection={<IconArrowLeft size={18} color={Colors.White} />}
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
