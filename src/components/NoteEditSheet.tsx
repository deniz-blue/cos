import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { RefObject, useEffect, useState } from "react";
import { useListMutation } from "../lib/useListMutation";
import { useListQuery } from "../lib/useListQuery";
import { Box } from "./base/Box";
import { Button } from "./base/button/Button";
import { TextInput } from "./base/input/TextInput";

export const NoteEditSheet = ({
	id,
	ref,
}: {
	id?: string | null;
	ref: RefObject<TrueSheet | null>;
}) => {
	const listQuery = useListQuery();
	const mut = useListMutation();

	const item = listQuery.data?.find((i) => i.id === id);

	const [noteText, setNoteText] = useState(item?.note ?? "");

	useEffect(() => {
		if (item) setNoteText(item.note);
	}, [item]);

	const onChangeText = (text: string) => {
		setNoteText(text);
		mut.mutate({ type: "update", item: { id: item?.id ?? "", note: text } });
	};

	return (
		<TrueSheet ref={ref} detents={["auto"]}>
			<Box mt="md" gap="md" p="md">
				<TextInput
					label={"Note for " + (item?.payload.name ?? "unknown")}
					placeholder="Note for later"
					value={noteText}
					onChangeText={onChangeText}
					multiline
					autoFocus
					style={{ minHeight: 80, textAlignVertical: "top" }}
				/>
				<Box direction="row" justify="flex-end">
					<Button variant="primary" onPress={() => ref.current?.dismiss()}>
						Done
					</Button>
				</Box>
			</Box>
		</TrueSheet>
	);
};
