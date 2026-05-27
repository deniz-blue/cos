import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator, Button, Dialog, IconButton, List, Portal, Text, useTheme } from "react-native-paper";
import { Box, Flex } from "../../components/layouting";
import { TextInput } from "../../components/TextInput";
import { createPayload, Payload } from "../../lib/payload";
import { KnownSocials } from "../../lib/socials";
import { useProfileMutation, useProfileQuery } from "../../lib/useProfileQuery";

export default function QrPage() {
	const router = useRouter();
	const theme = useTheme();
	const [dialogKey, setDialogKey] = useState<string | null>(null);
	const payloadQuery = useProfileQuery();
	const getInitial = () =>
		(payloadQuery.error || payloadQuery.isPending) ? null : (payloadQuery.data ?? createPayload())
	const [payload, _setPayload] = useState<Payload | null>(getInitial());

	useEffect(() => void _setPayload(p => p || getInitial()), [payloadQuery.data, payloadQuery.error, payloadQuery.isPending]);

	const mut = useProfileMutation();

	const setPayload = (payload: Payload) => {
		_setPayload(payload);
		mut.mutate(payload);
	};

	return (
		<ScrollView>
			<Flex direction="column" align="stretch" justify="center" p="md" gap="md">
				<Flex align="center" direction="row" gap="xs">
					<IconButton
						icon="arrow-left"
						onPress={() => router.push("..")}
						size={24}
					/>
					<Text variant="titleMedium">My QR Code</Text>
					{mut.isPending && (
						<ActivityIndicator
							size="small"
						/>
					)}
				</Flex>

				<Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
					Edit details about yourself here.
					Changes will be reflected immediately.
					Updates to your details will only affect future scans of your QR code.
				</Text>

				{!payload && (
					<Flex direction="column" align="center" gap="md">
						<ActivityIndicator size="large" />
					</Flex>
				)}

				{payload && (
					<Box>
						<TextInput
							label="Name"
							description="Enter your name"
							placeholder="bbno$"
							value={payload.name}
							onChangeText={(text) => setPayload({ ...payload, name: text })}
						/>

						<TextInput
							label="Details"
							description="Cosplay character, distinguishing features, etc."
							placeholder="Hatsune Miku"
							value={payload.details}
							onChangeText={(text) => setPayload({ ...payload, details: text })}
						/>

						{Object.entries(KnownSocials).map(([k, social]) => (
							<List.Item
								key={k}
								title={social.title}
								description={payload.socials[k] ?? ""}
								onPress={() => setDialogKey(k)}
							/>
						))}
					</Box>
				)}
			</Flex>

			<Portal>
				<Dialog
					visible={!!dialogKey}
					onDismiss={() => setDialogKey(null)}
					style={{ borderRadius: theme.roundness, margin: 0 }}
				>
					<Dialog.Content style={{ padding: 0, margin: 0 }}>
						<Box p="xs" mx="xs" pb={0}>
							<TextInput
								autoFocus
								label={KnownSocials[dialogKey ?? ""]?.title + " Username"}
								value={dialogKey ? payload?.socials[dialogKey] ?? "" : ""}
								autoCapitalize="none"
								autoComplete="off"
								autoCorrect={false}
								onChangeText={(text) => {
									if (!dialogKey) return;
									if (!payload) return;
									setPayload({
										...payload,
										socials: {
											...payload.socials,
											[dialogKey]: text,
										},
									});
								}}
								onSubmitEditing={() => setDialogKey(null)}
							/>
						</Box>
					</Dialog.Content>
					<Dialog.Actions style={{ padding: 0, margin: 0 }}>
						<Box p="xs" pt={0}>
							<Button onPress={() => setDialogKey(null)}>Done</Button>
						</Box>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</ScrollView>
	)
}
