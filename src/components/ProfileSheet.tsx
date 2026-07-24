import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { IconClock, IconTrash } from "@tabler/icons-react-native";
import { RefObject, useCallback, useRef } from "react";
import { ScrollView } from "react-native";
import { useListMutation } from "../lib/useListMutation";
import { ListItem, useListQuery } from "../lib/useListQuery";
import { Colors } from "../theme/colors";
import { FontSize, IconSize } from "../theme/sizing";
import { Box } from "./base/Box";
import { Button } from "./base/button/Button";
import { Text } from "./base/Text";
import { NoteSection } from "./NoteSection";
import { SocialsList } from "./SocialsList";

export const ProfileSheetFromId = ({
	id,
	ref,
}: {
	id: string;
	ref: RefObject<TrueSheet | null>;
}) => {
	const listQuery = useListQuery();
	const item = listQuery.data?.find((i) => i.id === id);

	if (!item) return null;

	return <ProfileSheet item={item} ref={ref} />;
};

export const ProfileSheet = ({
	item,
	ref,
	a11yRef,
}: {
	item: ListItem;
	ref: RefObject<TrueSheet | null>;
	a11yRef?: RefObject<any>;
}) => {
	const deleteSheetRef = useRef<TrueSheet | null>(null);

	const handleDeletePress = useCallback(() => {
		deleteSheetRef.current?.present();
	}, []);

	return (
		<TrueSheet ref={ref} detents={[0.6, 1]} scrollable={true}>
			<ScrollView>
				<Box mt="md" gap="md" p="md">
					<Box align="center">
						<Text fw="bold" fz={FontSize.h1} ref={a11yRef}>
							{item.payload.name}
						</Text>
						<Text fz={FontSize.lg}>{item.payload.details}</Text>
					</Box>

					<NoteSection id={item.id} />

					<SocialsList socials={item.payload.socials} />

					<Box direction="row" justify="space-between">
						<Box direction="row" gap="xs" align="center" accessible>
							<IconClock
								size={IconSize.xs}
								color={Colors.TextDimmed}
								accessibilityLabel="Scanned at"
							/>
							<Text c={Colors.TextDimmed} fz={FontSize.xs}>
								{new Date(item.created_at).toLocaleString()}
							</Text>
						</Box>
						<Button
							variant="subtle"
							color={Colors.Red}
							leftSection={<IconTrash size={IconSize.xs} color={Colors.Red} />}
							onPress={handleDeletePress}
						>
							Delete
						</Button>
					</Box>

					<ProfileDeleteSheet
						item={item}
						ref={deleteSheetRef}
						onDelete={() => ref.current?.dismiss()}
					/>
				</Box>
			</ScrollView>
		</TrueSheet>
	);
};

export const ProfileDeleteSheet = ({
	item,
	ref,
	onDelete: callbackOnDelete,
}: {
	item: ListItem;
	ref: RefObject<TrueSheet | null>;
	onDelete?: () => void;
}) => {
	const mut = useListMutation();

	const onDelete = () => {
		mut.mutate({ type: "delete", id: item.id });
		ref.current?.dismiss();
		callbackOnDelete?.();
	};

	return (
		<TrueSheet ref={ref} detents={["auto"]}>
			<Box mt="md" gap="md" p="md">
				<Text>
					Are you sure you want to delete the profile for {item.payload.name}? This action cannot be
					undone.
				</Text>

				<Button variant="subtle" color={Colors.Red} onPress={onDelete}>
					Delete
				</Button>
			</Box>
		</TrueSheet>
	);
};
