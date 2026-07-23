import {
	IconBrandBluesky,
	IconBrandDiscord,
	IconBrandInstagram,
	IconBrandLinktree,
	IconBrandMatrix,
	IconBrandSignal,
	IconBrandTelegram,
	IconBrandTiktok,
	IconBrandTumblr,
	IconBrandX,
} from "@tabler/icons-react-native";
import type { ElementType } from "react";

export interface KnownSocial {
	title: string;
	url: string;
	icon: ElementType;
	action?: "link" | "copy";
}

export const KnownSocials: Record<string, KnownSocial> = {
	// Most used
	d: {
		title: "Discord",
		url: "https://discord.com/users/$",
		icon: IconBrandDiscord,
		action: "copy",
	},
	i: { title: "Instagram", url: "https://instagram.com/$", icon: IconBrandInstagram },
	// Direct chat
	tg: { title: "Telegram", url: "https://t.me/$", icon: IconBrandTelegram },
	s: { title: "Signal", url: "https://signal.me/#p/$", icon: IconBrandSignal },
	m: { title: "Matrix", url: "https://matrix.to/#/$", icon: IconBrandMatrix },
	// Social media
	tt: { title: "TikTok", url: "https://tiktok.com/@$", icon: IconBrandTiktok },
	x: { title: "X (formerly Twitter)", url: "https://x.com/$", icon: IconBrandX },
	b: { title: "BlueSky", url: "https://bsky.app/profile/$", icon: IconBrandBluesky },
	t: { title: "Tumblr", url: "https://tumblr.com/$", icon: IconBrandTumblr },
	// Link lists
	l: { title: "LinkTree", url: "https://linktr.ee/$", icon: IconBrandLinktree },
};
