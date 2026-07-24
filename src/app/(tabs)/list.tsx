import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRef } from "react";
import { FlatList } from "react-native";
import { Box } from "../../components/base/Box";
import { ButtonBase } from "../../components/base/ButtonBase";
import { Card } from "../../components/base/Card";
import { Loader } from "../../components/base/Loader";
import { Text } from "../../components/base/Text";
import { ProfileSheet } from "../../components/ProfileSheet";
import { useA11yAutoFocus } from "../../hooks/useA11yAutoFocus";
import { KnownSocials } from "../../lib/socials";
import { ListItem, useListQuery } from "../../lib/useListQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function ListPage() {
	const query = useListQuery();
	const data = query.data ?? [];
	const a11yRef = useA11yAutoFocus();

	return (
		<FlatList
			data={data}
			role="list"
			keyExtractor={(item) => item.id}
			contentContainerStyle={{ padding: 16, gap: 12 }}
			ListHeaderComponent={
				<Box pt="sm" align="center" justify="center" direction="row">
					<Text fz={FontSize.md} fw="bold" role="heading" ref={a11yRef}>
						History
					</Text>
					{query.isPending && <Loader size="small" />}
				</Box>
			}
			renderItem={({ item }) => <ListItemCard item={item} />}
			ListEmptyComponent={() => (
				<Box
					direction="column"
					align="center"
					justify="center"
					w="100%"
					mih={300}
					gap="xs"
					accessible
				>
					<Text fz={FontSize.md} fw="bold">
						No profiles scanned yet
					</Text>
					<Text fz={FontSize.sm} c={Colors.TextDimmed}>
						Start scanning QR codes to see profiles here
					</Text>
				</Box>
			)}
		/>
	);
}

const ListItemCard = ({ item }: { item: ListItem }) => {
	const ref = useRef<TrueSheet | null>(null);
	const date = new Date(item.created_at).toLocaleString();

	const handlePress = () => {
		ref.current?.present();
	};

	return (
		<ButtonBase onPress={handlePress} role="listitem" tabIndex={0}>
			<Card>
				<Box>
					<Box direction="column" gap={0}>
						<Box direction="row" justify="space-between">
							<Text fz={FontSize.md} fw="bold">
								{item.payload.name}
							</Text>
							<Box direction="row">
								{Object.entries(item.payload.socials).map(([k]) => {
									const { icon: Icon } = KnownSocials[k];
									return <Icon aria-hidden key={k} size={IconSize.xs} color={Colors.Text} />;
								})}
							</Box>
						</Box>
						<Text fz={FontSize.sm}>{item.payload.details}</Text>
					</Box>
					<Text fz={FontSize.xs} c={Colors.TextDimmed} aria-hidden>
						{date}
					</Text>
				</Box>

				<ProfileSheet item={item} ref={ref} />
			</Card>
		</ButtonBase>
	);
};
