import { IconArrowLeft } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { Draft, produce } from "immer";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Box } from "../../components/base/Box";
import { ButtonBase } from "../../components/base/ButtonBase";
import { TextInput } from "../../components/base/input/TextInput";
import { Loader } from "../../components/base/Loader";
import { Text } from "../../components/base/Text";
import { useA11yAutoFocus } from "../../hooks/useA11yAutoFocus";
import { createPayload, Payload, sanitizePayload } from "../../lib/payload";
import { KnownSocials } from "../../lib/socials";
import { useProfileMutation, useProfileQuery } from "../../lib/useProfileQuery";
import { Colors } from "../../theme/colors";
import { FontSize, IconSize } from "../../theme/sizing";

export default function ProfilePage() {
	const router = useRouter();
	const payloadQuery = useProfileQuery();
	const [p, setLocalPayload] = useState<Payload | null>(() =>
		payloadQuery.error || payloadQuery.isPending ? null : (payloadQuery.data ?? createPayload()),
	);
	const payload = p ? sanitizePayload(p) : null;
	const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const a11yRef = useA11yAutoFocus();

	useEffect(() => {
		setLocalPayload((p) => p || (payloadQuery.data ?? createPayload()));
	}, [payloadQuery.data]);

	const mut = useProfileMutation();

	const setPayload = useCallback(
		(recipe: (prev: Draft<Payload>) => void) => {
			setLocalPayload((prev) => {
				const updated = produce(prev, recipe);
				if (!updated) return prev;
				if (saveTimeout.current) clearTimeout(saveTimeout.current);
				saveTimeout.current = setTimeout(() => mut.mutate(updated), 500);
				return updated;
			});
		},
		[mut],
	);

	return (
		<ScrollView style={{ flex: 1 }}>
			<KeyboardAvoidingView behavior="padding">
				<Box direction="column" align="stretch" justify="center" p="md" gap="md">
					<Box align="center" direction="row" gap="xs">
						<ButtonBase onPress={() => router.push("..")} aria-label="Back">
							<IconArrowLeft size={24} color={Colors.Text} />
						</ButtonBase>
						<Text fz={FontSize.lg} fw="bold" role="heading" ref={a11yRef}>
							Edit Profile
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
								required
								value={payload.name}
								onChangeText={(text) => setPayload((p) => void (p.name = text))}
								maxLength={128}
							/>

							<TextInput
								label="Details"
								description="Physical description, cosplay character, furry species, etc."
								value={payload.details}
								onChangeText={(text) => setPayload((p) => void (p.details = text))}
								maxLength={128}
							/>

							<Box>
								<Text fz={FontSize.md} role="heading" fw="bold">
									Socials
								</Text>
								<Text fz={FontSize.sm} c={Colors.TextDimmed}>
									Add your social media usernames here. You don't need to add every social media
									platform, just the ones you want to share.
								</Text>
							</Box>

							{Object.entries(KnownSocials).map(([key, { icon: Icon, title }]) => (
								<Box key={key}>
									<TextInput
										leftSection={<Icon size={IconSize.sm} color={Colors.TextDimmed} />}
										label={title}
										value={payload?.socials[key] ?? ""}
										autoCapitalize="none"
										autoComplete="off"
										autoCorrect={false}
										onChangeText={(text) => {
											setPayload((p) => void (p.socials[key] = text));
										}}
										maxLength={32}
									/>
								</Box>
							))}
						</Box>
					)}

					<Box h={200} />
				</Box>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}
