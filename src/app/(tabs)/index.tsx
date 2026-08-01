import { IconPencil, IconZoomScan } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { LayoutChangeEvent, ScrollView } from "react-native";
import QRCode from "react-qr-code";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/button/Button";
import { Fab } from "../../components/base/Fab";
import { Loader } from "../../components/base/Loader";
import { Text } from "../../components/base/Text";
import { useA11yAutoFocus } from "../../hooks/useA11yAutoFocus";
import { createPayload, isEmptyPayload, serializePayload } from "../../lib/payload";
import { useProfileQuery } from "../../lib/useProfileQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function QrPage() {
	const router = useRouter();
	const profile = useProfileQuery();
	const [qrSize, setQrSize] = useState(0);
	const a11yRef = useA11yAutoFocus();

	const onQrLayout = (e: LayoutChangeEvent) => setQrSize(e.nativeEvent.layout.width - 48);

	const qrcode = serializePayload(profile.data ?? createPayload());
	const hasData = profile.data && !isEmptyPayload(profile.data);

	return (
		<Box w="100%" h="100%">
			<ScrollView>
				<Box direction="column" align="center" justify="center" px="md" py="xl" gap="md">
					<Text fw="bold" role="heading" ta="center" ref={a11yRef}>
						Your QR Code
					</Text>

					<Box
						onLayout={onQrLayout}
						style={{
							width: "100%",
							aspectRatio: 1,
							position: "relative",
							borderRadius: 8,
							overflow: "hidden",
						}}
					>
						<Box
							p="lg"
							w="100%"
							h="100%"
							style={{ backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }}
						>
							{qrSize > 0 && <QRCode aria-hidden value={qrcode} size={qrSize} />}
						</Box>

						{profile.isPending && (
							<Box
								align="center"
								justify="center"
								w="100%"
								h="100%"
								style={{ position: "absolute", top: 0, left: 0 }}
							>
								<Loader />
							</Box>
						)}

						{!profile.isPending && !hasData && (
							<Box
								align="center"
								justify="center"
								w="100%"
								h="100%"
								p="md"
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									backgroundColor: Colors.Background,
								}}
							>
								<Text fz={FontSize.md} fw="bold" c={Colors.TextDimmed} ta="center">
									You don't have details!
								</Text>
							</Box>
						)}
					</Box>

					{!profile.isPending && (
						<Box direction="column" align="center" justify="center" gap="md">
							{hasData && (
								<Box gap={0} align="center" justify="center" direction="column">
									<Text fz={24}>{profile.data?.name ?? ""}</Text>
									<Text fz={18}>{profile.data?.details ?? ""}</Text>
								</Box>
							)}
							<Button
								variant="primary"
								leftSection={<IconPencil aria-hidden size={IconSize.sm} color={Colors.White} />}
								onPress={() => router.push("/(tabs)/profile")}
							>
								{hasData ? "Edit details" : "Add details"}
							</Button>
						</Box>
					)}

					<Box align="center" justify="center">
						<Text fz={FontSize.sm} c={Colors.TextDimmed} ta="center">
							This app allows you to use QR codes to share your social media usernames to people you
							meet without hassle.
							{"\n"}
							Scan QR codes of people you meet which will be saved to your history to view later.
						</Text>
					</Box>
				</Box>
			</ScrollView>

			<Fab
				icon={<IconZoomScan aria-hidden size={IconSize.lg} color={Colors.White} />}
				label="Scan QR Code"
				onPress={() => router.push("/camera")}
				accessibilityHint="Opens QR code scanner screen to continiously scan QR codes"
			/>
		</Box>
	);
}
