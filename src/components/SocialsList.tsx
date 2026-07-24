import { IconCopy, IconCopyCheck, IconExternalLink } from "@tabler/icons-react-native";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { Linking } from "react-native";
import { KnownSocials } from "../lib/socials";
import { Colors } from "../theme/colors";
import { FontSize, IconSize } from "../theme/sizing";
import { Box, type BoxProps } from "./base/Box";
import { ButtonBase } from "./base/ButtonBase";
import { Text } from "./base/Text";

interface SocialsListProps extends BoxProps {
	socials: Record<string, string>;
}

const COPIED_DURATION = 2000;

interface SocialItemProps {
	k: string;
	v: string;
}

const SocialItem = ({ k, v }: SocialItemProps) => {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const social = KnownSocials[k];
	if (!social) {
		return (
			<Box direction="row" gap="xs" align="center">
				<Text fz={FontSize.md} c={Colors.TextDimmed}>
					{k}:
				</Text>
				<Text fz={FontSize.sm}>{v}</Text>
			</Box>
		);
	}

	const Icon = social.icon;
	const url = social.url.replace("$", v);

	const handleCopy = async () => {
		await Clipboard.setStringAsync(v);
		setCopied(true);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), COPIED_DURATION);
	};

	const handlePress = () => {
		if (social.action === "copy") {
			handleCopy();
		} else {
			Linking.openURL(url);
		}
	};

	const handleLongPress = () => {
		if (social.action !== "copy") handleCopy();
	};

	return (
		<ButtonBase
			onPress={handlePress}
			onLongPress={handleLongPress}
			accessibilityLabel={`${social.title} username: ${v}`}
			accessibilityActions={
				social.action === "copy"
					? [{ name: "activate", label: `Copy username` }]
					: [
							{ name: "activate", label: `Open in ${social.title}` },
							{ name: "longpress", label: "Copy username" },
						]
			}
			onAccessibilityAction={(e) => {
				if (e.nativeEvent.actionName === "activate") handlePress();
				if (e.nativeEvent.actionName === "longpress") handleLongPress();
			}}
		>
			<Box direction="row" align="center" p="sm" radius={8} bg={Colors.Dark7}>
				<Icon aria-hidden size={IconSize.md} color={Colors.Text} />
				<Box direction="row" flex={1} justify="space-between" align="center" ml="sm">
					<Text fz={FontSize.sm} c={Colors.Text}>
						{social.title}
					</Text>
					<Box direction="row" gap="xs" align="center">
						<Text fz={FontSize.md} c={copied ? Colors.Primary : Colors.Text}>
							{v}
						</Text>
						{copied ? (
							<IconCopyCheck size={IconSize.xs} color={Colors.Primary} />
						) : social.action === "copy" ? (
							<IconCopy size={IconSize.xs} color={Colors.TextDimmed} />
						) : (
							<IconExternalLink size={IconSize.xs} color={Colors.TextDimmed} />
						)}
					</Box>
				</Box>
			</Box>
		</ButtonBase>
	);
};

export const SocialsList = ({ socials, ...rest }: SocialsListProps) => {
	const entries = Object.entries(socials).filter(([, v]) => !!v);

	if (entries.length === 0) {
		return (
			<Box align="center" {...rest}>
				<Text fz={FontSize.md} c={Colors.TextDimmed}>
					No socials
				</Text>
			</Box>
		);
	}

	return (
		<Box direction="column" gap="md" {...rest}>
			{entries.map(([k, v]) => (
				<SocialItem key={k} k={k} v={v} />
			))}
		</Box>
	);
};
