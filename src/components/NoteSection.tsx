import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { IconNote, IconPencil } from "@tabler/icons-react-native";
import { useRef } from "react";
import { useListQuery } from "../lib/useListQuery";
import { Colors } from "../theme/colors";
import { FontSize, IconSize } from "../theme/sizing";
import { Box } from "./base/Box";
import { Button } from "./base/button/Button";
import { Text } from "./base/Text";
import { NoteEditSheet } from "./NoteEditSheet";

export const NoteSection = ({ id }: { id?: string | null }) => {
	const ref = useRef<TrueSheet | null>(null);
	const listQuery = useListQuery();
	const item = listQuery.data?.find((i) => i.id === id);
	const note = item?.note;

	return (
		<Box bg={Colors.Dark7} radius={8} p="sm" direction="column" gap="xs">
			<Box direction="row" justify="space-between" align="center">
				<Box direction="row" gap="xs" align="center" accessible role="heading">
					<IconNote size={IconSize.xs} color={Colors.Text} aria-hidden />
					<Text fz={FontSize.md} fw="bold" c={Colors.Text}>
						Note
					</Text>
				</Box>
				<Button
					variant="subtle"
					size="md"
					py={0}
					leftSection={<IconPencil size={IconSize.xs} color={Colors.Primary} />}
					onPress={() => ref.current?.present()}
				>
					Edit Note
				</Button>
			</Box>

			<Text
				fz={FontSize.sm}
				c={note ? Colors.Text : Colors.TextDimmed}
				role="note"
				accessibilityLabel={note ? undefined : "No note set"}
			>
				{note || "<no note>"}
			</Text>

			<NoteEditSheet id={id} ref={ref} />
		</Box>
	);
};
