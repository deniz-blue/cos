import { TrueSheet } from "@lodev09/react-native-true-sheet";
import {
	IconAlertCircle,
	IconArrowLeft,
	IconCheck,
	IconInfoCircle,
	IconPencil,
} from "@tabler/icons-react-native";
import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "../components/base/Box";
import { Button } from "../components/base/button/Button";
import { ButtonBase } from "../components/base/ButtonBase";
import { Card } from "../components/base/Card";
import { Loader } from "../components/base/Loader";
import { ProgressBar } from "../components/base/ProgressBar";
import { Text } from "../components/base/Text";
import { NoteEditSheet } from "../components/NoteEditSheet";
import { ProfileSheetFromId } from "../components/ProfileSheet";
import type { QueueMessage } from "../lib/use-scanner";
import { useScanner } from "../lib/use-scanner";
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
	const { messages, handleScan } = useScanner();
	const noteRef = useRef<TrueSheet | null>(null);
	const profileRef = useRef<TrueSheet | null>(null);
	const [id, setId] = useState<string | null>(null);

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

			{id && (
				<>
					<NoteEditSheet id={id} ref={noteRef} />
					<ProfileSheetFromId id={id} ref={profileRef} />
				</>
			)}

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
							<Notification
								key={message.id}
								message={message}
								onProfile={(id) => {
									setId(id);
									profileRef.current?.present();
								}}
								onNote={(id) => {
									setId(id);
									noteRef.current?.present();
								}}
							/>
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
		</Box>
	);
}

export const Notification = ({
	message,
	onNote,
	onProfile,
}: {
	message: QueueMessage;
	onProfile: (id: string) => void;
	onNote: (id: string) => void;
}) => {
	return (
		<Animated.View
			key={message.id}
			entering={FadeInDown.duration(300)}
			exiting={FadeOutDown.duration(250)}
			layout={LinearTransition.springify().mass(0.4)}
		>
			<Card bg="rgba(0,0,0,0.8)">
				<Box direction="row" align="center" justify="space-between" p="xs">
					<ButtonBase
						onPress={() => onProfile(message.id)}
						role="dialog"
						accessibilityActions={[{ name: "activate", label: "View Profile" }]}
						onAccessibilityAction={(e) => {
							if (e.nativeEvent.actionName === "activate") onProfile(message.id);
						}}
					>
						<Box direction="row" gap="xs" align="center">
							{iconForType(message.type)}
							<Text fw="bold" c={Colors.TextDimmed}>
								{labelForType(message.type)}
							</Text>
							<Text>{messageText(message)}</Text>
						</Box>
					</ButtonBase>

					{message.type !== "error" && (
						<Button
							variant="subtle"
							py={0}
							leftSection={<IconPencil size={IconSize.xs} color={Colors.Primary} />}
							onPress={() => onNote(message.id)}
							accessibilityLabel="Set Note"
						>
							Note
						</Button>
					)}
				</Box>
			</Card>
		</Animated.View>
	);
};
