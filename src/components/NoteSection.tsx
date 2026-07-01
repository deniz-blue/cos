import { IconNote, IconPencil } from "@tabler/icons-react-native";
import { Box } from "./base/Box";
import { Button } from "./base/Button";
import { Text } from "./base/Text";
import { Colors } from "../theme/colors";
import { FontSize, IconSize } from "../theme/sizing";

interface NoteSectionProps {
	note: string;
	onEdit: () => void;
}

export const NoteSection = ({ note, onEdit }: NoteSectionProps) => {
	return (
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
					onPress={onEdit}
				>
					Edit
				</Button>
			</Box>
			<Text fz={FontSize.sm} c={note ? Colors.Text : Colors.TextDimmed}>
				{note || "<no note>"}
			</Text>
		</Box>
	);
};
