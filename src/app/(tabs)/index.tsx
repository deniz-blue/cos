import { IconPencil, IconZoomScan } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, LayoutChangeEvent, ScrollView } from "react-native";
import QRCode from "react-qr-code";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/button/Button";
import { Fab } from "../../components/base/Fab";
import { Loader } from "../../components/base/Loader";
import { Text } from "../../components/base/Text";
import { createPayload, isEmptyPayload, serializePayload } from "../../lib/payload";
import { useProfileQuery } from "../../lib/useProfileQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function QrPage() {
	const router = useRouter();
	const profile = useProfileQuery();
	const [qrSize, setQrSize] = useState(0);

	const onQrLayout = (e: LayoutChangeEvent) => setQrSize(e.nativeEvent.layout.width - 48);

	const qrcode = serializePayload(profile.data ?? createPayload());
	const hasData = profile.data && !isEmptyPayload(profile.data);

	console.log(
		"[home] profile.data:",
		profile.data,
		"isEmpty:",
		profile.data && isEmptyPayload(profile.data),
		"hasData:",
		hasData,
	);

	return (
		<Box w="100%" h="100%">
			<ScrollView contentContainerStyle={{ minHeight: Dimensions.get("window").height - 64 - 16 }}>
				<Box direction="column" align="center" justify="center" px="md" py="xl" gap="md">
					<Text fw="600" ta="center">
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
							{qrSize > 0 && <QRCode value={qrcode} size={qrSize} />}
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
								<Text fz={16} fw="500" c={Colors.TextDimmed} ta="center">
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
								leftSection={<IconPencil size={18} color={Colors.White} />}
								onPress={() => router.push("/(tabs)/profile")}
							>
								{hasData ? "Edit details" : "Add details"}
							</Button>
						</Box>
					)}

					<Box mih={48} align="center" justify="center">
						<Text fz={FontSize.sm} c={Colors.TextDimmed} ta="center">
							Share socials with others.
							{"\n"}
							Sharing is done via QR codes; works offline.
							{"\n"}
							Scanned profiles get saved to your history immediately.
							{"\n"}
							You can add notes to them and view them later.
						</Text>
					</Box>
				</Box>
			</ScrollView>

			<Fab
				icon={<IconZoomScan size={IconSize.lg} color={Colors.White} />}
				label="Scan QR Code"
				onPress={() => router.push("/camera")}
			/>
		</Box>
	);
}
