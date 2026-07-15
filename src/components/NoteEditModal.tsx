import { useEffect, useState } from "react";
import { Box } from "./base/Box";
import { Button } from "./base/button/Button";
import { TextInput } from "./base/input/TextInput";
import { Modal } from "./base/Modal";

interface NoteEditModalProps {
	visible: boolean;
	initialNote?: string;
	onSave: (note: string) => void;
	onDismiss: () => void;
}

export const NoteEditModal = ({
	visible,
	initialNote = "",
	onSave,
	onDismiss,
}: NoteEditModalProps) => {
	const [noteText, setNoteText] = useState(initialNote);

	useEffect(() => {
		if (visible) {
			setNoteText(initialNote);
		}
	}, [visible, initialNote]);

	return (
		<Modal visible={visible} onDismiss={onDismiss}>
			<Box gap="md">
				<TextInput
					label="Note"
					placeholder="Write a note about this person..."
					value={noteText}
					onChangeText={setNoteText}
					multiline
					autoFocus
					style={{ minHeight: 40, textAlignVertical: "top" }}
				/>
				<Box direction="row" justify="flex-end">
					<Button variant="primary" onPress={() => onSave(noteText)}>
						Save
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
