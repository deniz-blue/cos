import { IconChevronDown, IconChevronUp, IconTrash } from "@tabler/icons-react-native";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/Button";
import { Card } from "../../components/base/Card";
import { Loader } from "../../components/base/Loader";
import { Modal } from "../../components/base/Modal";
import { Text } from "../../components/base/Text";
import { useListMutation } from "../../lib/useListMutation";
import { ListItem, useListQuery } from "../../lib/useListQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";
import { SocialsList } from "../../components/SocialsList";
import { NoteSection } from "../../components/NoteSection";
import { NoteEditModal } from "../../components/NoteEditModal";

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
	const [deleteDialog, setDeleteDialog] = useState(false);
	const mut = useListMutation();
	const date = new Date(item.created_at).toLocaleString();

	const saveNote = (note: string) => {
		mut.mutate({ type: "update", item: { id: item.id, note } });
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
						<NoteSection note={item.note} onEdit={() => setNoteDialog(true)} />

						<SocialsList socials={item.payload.socials} />

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

			<NoteEditModal
				visible={noteDialog}
				initialNote={item.note}
				onSave={saveNote}
				onDismiss={() => setNoteDialog(false)}
			/>

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
