import { IconChevronDown, IconChevronUp, IconExternalLink, IconNote, IconPencil, IconTrash } from "@tabler/icons-react-native";
import { useState } from "react";
import { FlatList, Linking, TouchableOpacity } from "react-native";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/Button";
import { Card } from "../../components/base/Card";
import { Loader } from "../../components/base/Loader";
import { Modal } from "../../components/base/Modal";
import { Text } from "../../components/base/Text";
import { TextInput } from "../../components/base/TextInput";
import { KnownSocials } from "../../lib/socials";
import { useListMutation } from "../../lib/useListMutation";
import { ListItem, useListQuery } from "../../lib/useListQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function ListPage() {
	const query = useListQuery();
	const data = query.data ?? [];

	if (query.isPending) return (
		<Box direction="column" align="center" justify="center" w="100%" h="100%">
			<Loader size="large" />
		</Box>
	);

	return (
		<FlatList
			data={data}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{ padding: 16, gap: 12 }}
			ListHeaderComponent={
				<Box pt="sm" align="center">
					<Text fz={FontSize.md} fw="500">Scanned Profiles</Text>
				</Box>
			}
			renderItem={({ item }) => <ListItemCard item={item} />}
			ListEmptyComponent={() => (
				<Box direction="column" align="center" justify="center" w="100%" mih={300} gap="md">
					<Text fz={FontSize.md} fw="500">No profiles scanned yet</Text>
					<Text fz={FontSize.sm} c={Colors.TextDimmed}>
						Start scanning QR codes to see profiles here
					</Text>
				</Box>
			)}
		/>
	);
}

const ListItemCard = ({ item }: { item: ListItem }) => {
	const [expanded, setExpanded] = useState(false);
	const [noteDialog, setNoteDialog] = useState(false);
	const [noteText, setNoteText] = useState("");
	const [deleteDialog, setDeleteDialog] = useState(false);
	const mut = useListMutation();
	const date = new Date(item.created_at).toLocaleString();

	const socials = Object.entries(item.payload.socials).filter(([, v]) => !!v);

	const saveNote = () => {
		mut.mutate({ type: "update", item: { id: item.id, note: noteText } });
		setNoteDialog(false);
	};

	return (
		<>
			<Card>
				<TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.7}>
					<Box direction="row" justify="space-between" align="center" gap="xs">
						<Box>
							<Text fz={FontSize.xs} c={Colors.TextDimmed}>{date}</Text>
							<Box direction="row" gap="xs">
								<Box justify="center" h={20}>
									{expanded
										? <IconChevronUp size={IconSize.xs} color={Colors.TextDimmed} />
										: <IconChevronDown size={IconSize.xs} color={Colors.TextDimmed} />
									}
								</Box>
								<Box direction="column" gap={0}>
									<Text fz={FontSize.md} fw="500">{item.payload.name}</Text>
									<Text fz={FontSize.sm} c={Colors.TextDimmed}>{item.payload.details}</Text>
								</Box>
							</Box>
						</Box>
					</Box>
				</TouchableOpacity>
				{expanded && (
					<Box direction="column" gap="sm" pt="sm">
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

						<Box direction="column" gap="sm">
							{socials.length > 0
								? socials.map(([k, v]) => {
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
								})
								: <Box align="center"><Text fz={FontSize.md} c={Colors.TextDimmed}>No socials</Text></Box>
							}
						</Box>

						<Button
							variant="subtle"
							color={Colors.Red}
							leftSection={<IconTrash size={IconSize.xs} color={Colors.Red} />}
							onPress={() => setDeleteDialog(true)}
						>
							Delete
						</Button>
					</Box>
				)}
			</Card>

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

			<Modal visible={deleteDialog} onDismiss={() => setDeleteDialog(false)}>
				<Box gap="md">
					<Text fz={FontSize.md}>Delete this profile?</Text>
					<Text fz={FontSize.sm} c={Colors.TextDimmed}>
						This action cannot be undone.
					</Text>
					<Box direction="row" gap="sm" justify="flex-end">
						<Button
							variant="subtle"
							onPress={() => setDeleteDialog(false)}
						>
							Cancel
						</Button>
						<Button
							variant="danger"
							onPress={() => {
								mut.mutate({ type: "delete", id: item.id });
								setDeleteDialog(false);
							}}
						>
							Delete
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
};
