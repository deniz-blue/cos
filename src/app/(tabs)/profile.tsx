import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { Box } from "../../components/base/Box";
import { Button } from "../../components/base/Button";
import { InputWrapper } from "../../components/base/InputWrapper";
import { Loader } from "../../components/base/Loader";
import { Modal } from "../../components/base/Modal";
import { Text } from "../../components/base/Text";
import { TextInput } from "../../components/base/TextInput";
import { createPayload, Payload } from "../../lib/payload";
import { KnownSocials } from "../../lib/socials";
import { useProfileMutation, useProfileQuery } from "../../lib/useProfileQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function ProfilePage() {
	const router = useRouter();
	const [dialogKey, setDialogKey] = useState<string | null>(null);
	const payloadQuery = useProfileQuery();
	const [payload, setLocalPayload] = useState<Payload | null>(() =>
		payloadQuery.error || payloadQuery.isPending ? null : (payloadQuery.data ?? createPayload()),
	);
	const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		setLocalPayload((p) => p || (payloadQuery.data ?? createPayload()));
	}, [payloadQuery.data]);

	const mut = useProfileMutation();

	const setPayload = useCallback(
		(updated: Payload) => {
			setLocalPayload(updated);
			if (saveTimeout.current) clearTimeout(saveTimeout.current);
			saveTimeout.current = setTimeout(() => mut.mutate(updated), 500);
		},
		[mut],
	);

	const dialogSocial = dialogKey ? KnownSocials[dialogKey] : undefined;

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ScrollView>
				<Box direction="column" align="stretch" justify="center" p="md" gap="md">
					<Box align="center" direction="row" gap="xs">
						<TouchableOpacity onPress={() => router.push("..")}>
							<IconArrowLeft size={24} color={Colors.Text} />
						</TouchableOpacity>
						<Text fz={FontSize.lg} fw="500">
							My QR Code
						</Text>
						{mut.isPending && <Loader size="small" />}
					</Box>

					<Text fz={FontSize.sm} c={Colors.TextDimmed}>
						Edit details about yourself here.
						{"\n"}
						Changes will be reflected immediately.
						{"\n"}
						Updates to your details will only affect future scans of your QR code.
					</Text>

					{!payload && (
						<Box direction="column" align="center" gap="md">
							<Loader size="large" />
						</Box>
					)}

					{payload && (
						<Box gap="md">
							<TextInput
								label="Name"
								description="Enter your name"
								placeholder="John Mantle"
								required
								value={payload.name}
								onChangeText={(text) => setPayload({ ...payload, name: text })}
								maxLength={128}
							/>

							<TextInput
								label="Details"
								description="Cosplay character, distinguishing features, etc."
								placeholder="Hatsune Miku"
								value={payload.details}
								onChangeText={(text) => setPayload({ ...payload, details: text })}
								maxLength={128}
							/>

							<InputWrapper label="Socials" description="Enter your social media usernames" />

							{Object.entries(KnownSocials).map(([k, social]) => (
								<Box
									key={k}
									component={TouchableOpacity}
									onPress={() => setDialogKey(k)}
									activeOpacity={0.7}
									bg={Colors.BackgroundInput}
									radius={8}
									px="sm"
									py="sm"
								>
									<Box direction="row" align="center" gap="sm">
										<social.icon size={IconSize.md} color={Colors.TextDimmed} />
										<Box flex={1}>
											<InputWrapper label={social.title} description={payload.socials[k]} />
										</Box>
										<IconChevronRight size={18} color={Colors.TextDimmed} />
									</Box>
								</Box>
							))}
						</Box>
					)}
				</Box>

				<Modal visible={!!dialogKey} onDismiss={() => setDialogKey(null)}>
					<Box p="xs" mx="xs" pb={0}>
						<TextInput
							autoFocus
							label={dialogSocial?.title + " Username"}
							value={dialogKey ? (payload?.socials[dialogKey] ?? "") : ""}
							autoCapitalize="none"
							autoComplete="off"
							autoCorrect={false}
							onChangeText={(text) => {
								if (!dialogKey || !payload) return;
								setPayload({
									...payload,
									socials: { ...payload.socials, [dialogKey]: text },
								});
							}}
							onSubmitEditing={() => setDialogKey(null)}
							maxLength={32}
						/>
					</Box>
					<Box direction="row" justify="flex-end" p="xs" pt={0}>
						<Button variant="subtle" onPress={() => setDialogKey(null)}>
							Done
						</Button>
					</Box>
				</Modal>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
