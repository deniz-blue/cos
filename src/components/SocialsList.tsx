import { IconCopy, IconExternalLink } from "@tabler/icons-react-native";
import * as Clipboard from "expo-clipboard";
import { Linking, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Box, type BoxProps } from "./base/Box";
import { Text } from "./base/Text";
import { KnownSocials } from "../lib/socials";
import { Colors } from "../theme/colors";
import { FontSize, IconSize } from "../theme/sizing";

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

	useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

	const social = KnownSocials[k];
	if (!social) {
		return (
			<Box direction="row" gap="xs" align="center">
				<Text fz={FontSize.md} c={Colors.TextDimmed}>{k}:</Text>
				<Text fz={FontSize.sm}>{v}</Text>
			</Box>
		);
	}

	const Icon = social.icon;
	const url = social.url.replace("$", v);

	const handlePress = () => {
		if (social.action === "copy") {
			Clipboard.setStringAsync(v);
			setCopied(true);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), COPIED_DURATION);
		} else {
			Linking.openURL(url);
		}
	};

	return (
		<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
			<Box direction="row" align="center" p="sm" radius={8} bg={Colors.Dark7}>
				<Icon size={IconSize.md} color={Colors.Text} />
				<Box direction="row" flex={1} justify="space-between" align="center" ml="sm">
					<Text fz={FontSize.sm} c={Colors.Text}>{social.title}</Text>
					<Box direction="row" gap="xs" align="center">
						<Text fz={FontSize.md} c={copied ? Colors.Primary : Colors.Text}>{v}</Text>
						{copied
							? <Text fz={FontSize.xs} c={Colors.Primary}>Copied!</Text>
							: social.action === "copy"
								? <IconCopy size={IconSize.xs} color={Colors.TextDimmed} />
								: <IconExternalLink size={IconSize.xs} color={Colors.TextDimmed} />
						}
					</Box>
				</Box>
			</Box>
		</TouchableOpacity>
	);
};

export const SocialsList = ({ socials, ...rest }: SocialsListProps) => {
	const entries = Object.entries(socials).filter(([, v]) => !!v);

	if (entries.length === 0) {
		return (
			<Box align="center" {...rest}>
				<Text fz={FontSize.md} c={Colors.TextDimmed}>No socials</Text>
			</Box>
		);
	}

	return (
		<Box direction="column" gap="sm" {...rest}>
			{entries.map(([k, v]) => (
				<SocialItem key={k} k={k} v={v} />
			))}
		</Box>
	);
};
