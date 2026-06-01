import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { FlatList, ScrollView } from "react-native";
import { ActivityIndicator, Text, TouchableRipple, useTheme } from "react-native-paper";
import { Box, Flex } from "../../components/layouting";
import { useListMutation } from "../../lib/useListMutation";
import { ListItem, useInfiniteListQuery } from "../../lib/useListQuery";

export default function QrPage() {
	const theme = useTheme();
	const query = useInfiniteListQuery();
	const mut = useListMutation();

	const flat = query.data?.pages.flatMap(page => page.data) ?? [];

	if (query.isPending) return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			w="100%"
			h="100%"
		>
			<ActivityIndicator size="large" />
		</Flex>
	);

	return (
		<ScrollView>
			<Flex pt="md" align="center">
				<Text
					variant="titleMedium"
				>
					Scanned Profiles
				</Text>
			</Flex>

			<FlatList
				data={flat}

				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={{ padding: 16, gap: 12 }}
				renderItem={({ item }) => (
					<ListItemCard item={item} />
				)}
				onEndReached={() => {
					if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
				}}
				onEndReachedThreshold={0.5}

				ListEmptyComponent={() => (
					<Flex direction="column" align="center" justify="center" w="100%" h="100%" gap="md">
						<Text variant="titleMedium">
							No profiles scanned yet
						</Text>
						<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
							Start scanning QR codes to see profiles here
						</Text>
					</Flex>
				)}

				ListFooterComponent={(
					query.isFetchingNextPage ? (
						<ActivityIndicator animating={true} style={{ marginVertical: 16 }} />
					) : null
				)}
			/>
		</ScrollView>
	)
}

export const ListItemCard = ({ item }: { item: ListItem }) => {
	const theme = useTheme();
	const [expanded, setExpanded] = useState(false);

	const date = new Date(item.created_at).toLocaleString();

	return (
		<Box
			style={{ backgroundColor: theme.colors.surface, borderRadius: theme.roundness }}
		>
			<TouchableRipple onPress={() => setExpanded(e => !e)}>
				<Flex direction="row" justify="space-between" align="center" gap="xs" p="md">
					<Flex>
						<Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
							{date}
						</Text>
						<Flex direction="row" gap="xs" align="center">
							<MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={theme.colors.onSurfaceVariant} />
							<Flex direction="column" gap={0}>
								<Text variant="titleMedium">
									{item.payload.name}
								</Text>
								<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
									{item.payload.details}
								</Text>
							</Flex>
						</Flex>
					</Flex>
					{/* <Flex>
						<IconButton
							style={{ margin: 0 }}
							size={18}
							icon="trash-can"
							onPress={() => { }}
						/>
					</Flex> */}
				</Flex>
			</TouchableRipple>
			{!!expanded && (
				<Flex direction="column" gap="xs" p="md">
					{!!item.note && (
						<Flex direction="column" gap={0}>
							<Flex direction="row" gap="xs" align="center">
								<MaterialCommunityIcons name="note-outline" size={18} color={theme.colors.onSurfaceVariant} />
								<Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
									Note
								</Text>
							</Flex>
							<Text variant="bodyMedium">
								{item.note}
							</Text>
						</Flex>
					)}

					{!!Object.keys(item.payload.socials).length && (
						<Flex direction="column" gap={0}>
							{Object.entries(item.payload.socials).map(([k, v]) => (
								<Flex key={k} direction="row" gap="xs" align="center">
									<Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
										{k}:
									</Text>
									<Text variant="bodyMedium">
										{v}
									</Text>
								</Flex>
							))}
						</Flex>
					)}
				</Flex>
			)}
		</Box>
	);
};
