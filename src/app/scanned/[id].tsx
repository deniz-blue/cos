import { IconExternalLink, IconHistory, IconQrcode, IconZoomScan } from "@tabler/icons-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/Button";
import { Loader } from "../../components/base/Loader";
import { Text } from "../../components/base/Text";
import { NoteEditModal } from "../../components/NoteEditModal";
import { NoteSection } from "../../components/NoteSection";
import { SocialsList } from "../../components/SocialsList";
import { QR_BASE, serializePayload } from "../../lib/payload";
import { useListMutation } from "../../lib/useListMutation";
import { useListQuery } from "../../lib/useListQuery";
import { Colors } from "../../theme/colors";
import { FontSize } from "../../theme/sizing";

export default function ScannedProfilePage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const listQuery = useListQuery();
	const mut = useListMutation();
	const [noteDialog, setNoteDialog] = useState(false);

	const item = listQuery.data?.find(i => i.id === id);

	if (listQuery.isPending || !item) {
		return (
			<Box direction="column" align="center" justify="center" w="100%" h="100%">
				<Loader size="large" />
			</Box>
		);
	}

	const saveNote = (note: string) => {
		mut.mutate({ type: "update", item: { id: item.id, note } });
		setNoteDialog(false);
	};

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<Box direction="column" align="center" justify="center" p="md" gap="md" w="100%" mih="100%">

				<Box direction="column" align="center" gap="xs">
					<Text c={Colors.TextDimmed} fz={FontSize.sm}>
						Contact saved - find them later in history
					</Text>
					<Text fz={32} fw="600">{item.payload.name}</Text>
					{!!item.payload.details && (
						<Text fz={20} c={Colors.TextDimmed}>{item.payload.details}</Text>
					)}
				</Box>

				<SocialsList socials={item.payload.socials} w="100%" style={{ maxWidth: 400 }} />

				<Box w="100%" style={{ maxWidth: 400 }}>
					<NoteSection note={item.note} onEdit={() => setNoteDialog(true)} />
				</Box>

				<Box direction="row" gap="sm" justify="center">
					<Button
						variant="subtle"
						leftSection={<IconQrcode size={18} color={Colors.Primary} />}
						onPress={() => router.replace("/(tabs)")}
					>
						My QR
					</Button>
					<Button
						variant="subtle"
						leftSection={<IconHistory size={18} color={Colors.Primary} />}
						onPress={() => router.replace("/(tabs)/list")}
					>
						View History
					</Button>
					<Button
						variant="primary"
						leftSection={<IconZoomScan size={18} color={Colors.White} />}
						onPress={() => router.replace("/camera")}
					>
						Scan more
					</Button>
				</Box>

				{Platform.OS === "web" && /Android/i.test(navigator.userAgent) && (
					<Box direction="column" align="center" gap="sm">
						<Button
							variant="subtle"
							leftSection={<IconExternalLink size={18} color={Colors.Primary} />}
							onPress={() => {
								const hash = serializePayload(item.payload).slice(QR_BASE.length + 1);
								const playStoreUrl = "https://play.google.com/store/apps/details?id=lt.tsx.cos";
								const intentUrl = `intent://cos.tsx.lt#${hash}#Intent;scheme=https;package=lt.tsx.cos;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
								window.location.href = intentUrl;
							}}
						>
							Open in app
						</Button>
						<Button
							variant="subtle"
							leftSection={<IconExternalLink size={18} color={Colors.Primary} />}
							onPress={() => {
								window.location.href = "https://play.google.com/store/apps/details?id=lt.tsx.cos";
							}}
						>
							Get on Play Store
						</Button>
					</Box>
				)}
			</Box>

			<NoteEditModal
				visible={noteDialog}
				initialNote={item.note}
				onSave={saveNote}
				onDismiss={() => setNoteDialog(false)}
			/>
		</ScrollView>
	);
}
