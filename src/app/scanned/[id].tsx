import { IconExternalLink, IconNote, IconPencil, IconQrcode, IconZoomScan } from "@tabler/icons-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Platform, ScrollView, TouchableOpacity } from "react-native";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/Button";
import { Loader } from "../../components/base/Loader";
import { Modal } from "../../components/base/Modal";
import { Text } from "../../components/base/Text";
import { TextInput } from "../../components/base/TextInput";
import { QR_BASE, serializePayload } from "../../lib/payload";
import { KnownSocials } from "../../lib/socials";
import { useListMutation } from "../../lib/useListMutation";
import { useListQuery } from "../../lib/useListQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function ScannedProfilePage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const listQuery = useListQuery();
	const mut = useListMutation();
	const [noteText, setNoteText] = useState("");
	const [noteDialog, setNoteDialog] = useState(false);

	const item = listQuery.data?.find(i => i.id === id);

	if (listQuery.isPending || !item) {
		return (
			<Box direction="column" align="center" justify="center" w="100%" h="100%">
				<Loader size="large" />
			</Box>
		);
	}

	const socials = Object.entries(item.payload.socials).filter(([, v]) => !!v);

	const saveNote = () => {
		mut.mutate({ type: "update", item: { id: item.id, note: noteText } });
		setNoteDialog(false);
	};

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<Box direction="column" align="center" justify="center" p="md" gap="md" w="100%" mih="100%">

				<Box direction="column" align="center" gap="xs">
					<Text c={Colors.TextDimmed} fz={FontSize.sm}>
						Profile saved to your list
					</Text>
					<Text fz={32} fw="600">{item.payload.name}</Text>
					{item.payload.details && (
						<Text fz={20} c={Colors.TextDimmed}>{item.payload.details}</Text>
					)}
				</Box>

				{socials.length > 0 && (
					<Box direction="column" gap="sm" w="100%" style={{ maxWidth: 400 }}>
						{socials.map(([k, v]) => {
							const social = KnownSocials[k];
							const Icon = social?.icon;
							if (!social) {
								return (
									<Box key={k} direction="row" gap="xs" align="center">
										<Text fz={FontSize.md} c={Colors.TextDimmed}>{k}:</Text>
										<Text fz={FontSize.sm}>{v}</Text>
									</Box>
								);
							}
							const url = social.url.replace("$", v);
							return (
								<TouchableOpacity
									key={k}
									onPress={() => Linking.openURL(url)}
									activeOpacity={0.7}
								>
									<Box
										direction="row"
										align="center"
										p="sm"
										radius={8}
										bg={Colors.Dark7}
									>
										<Icon size={IconSize.md} color={Colors.Text} />
										<Box direction="row" flex={1} justify="space-between" align="center" ml="sm">
											<Text fz={FontSize.sm} c={Colors.Text}>{social.title}</Text>
											<Box direction="row" gap="xs" align="center">
												<Text fz={FontSize.md} c={Colors.Text}>{v}</Text>
												<IconExternalLink size={IconSize.xs} color={Colors.TextDimmed} />
											</Box>
										</Box>
									</Box>
								</TouchableOpacity>
							);
						})}
					</Box>
				)}

				<Box direction="column" gap="xs" w="100%" style={{ maxWidth: 400 }}>
					<Box
						bg={Colors.Dark7}
						radius={8}
						p="sm"
						direction="column"
						gap="xs"
					>
						<Box direction="row" justify="space-between" align="center">
							<Box direction="row" gap="xs" align="center">
								<IconNote size={IconSize.xs} color={Colors.Text} />
								<Text fz={FontSize.sm} c={Colors.Text}>Note</Text>
							</Box>
							<Button
								variant="subtle"
								size="sm"
								py={0}
								leftSection={<IconPencil size={IconSize.xs} color={Colors.Primary} />}
								onPress={() => { setNoteText(item.note); setNoteDialog(true); }}
							>
								Edit
							</Button>
						</Box>
						<Text fz={FontSize.sm} c={item.note ? Colors.Text : Colors.TextDimmed}>
							{item.note || "<no note>"}
						</Text>
					</Box>
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
						variant="primary"
						leftSection={<IconZoomScan size={18} color={Colors.White} />}
						onPress={() => router.replace("/camera")}
					>
						Scan more
					</Button>
				</Box>

				{Platform.OS === "web" && (
					<Box direction="column" align="center" gap="sm">
						<Button
							variant="subtle"
							leftSection={<IconExternalLink size={18} color={Colors.Primary} />}
							onPress={() => {
								const hash = serializePayload(item.payload).slice(QR_BASE.length + 1);
								const playStoreUrl = "https://play.google.com/store/apps/details?id=lt.tsx.cos";
								const intentUrl = `intent://cos.tsx.lt#${hash}#Intent;scheme=https;package=lt.tsx.cos;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
								Linking.openURL(intentUrl).catch(() => {
									Linking.openURL(playStoreUrl);
								});
							}}
						>
							Open in app
						</Button>
						<Text fz={FontSize.sm} c={Colors.TextDimmed}>
							Google Play
						</Text>
					</Box>
				)}
			</Box>

			<Modal visible={noteDialog} onDismiss={() => setNoteDialog(false)}>
				<Box gap="md">
					<TextInput
						label="Note"
						placeholder="Write a note about this person..."
						value={noteText}
						onChangeText={setNoteText}
						multiline
						autoFocus
						style={{ minHeight: 120 }}
					/>
					<Box direction="row" justify="flex-end">
						<Button variant="primary" onPress={saveNote}>Save</Button>
					</Box>
				</Box>
			</Modal>
		</ScrollView>
	);
}
