import type { ElementType } from "react";
import {
	IconBrandInstagram,
	IconBrandDiscord,
	IconBrandTiktok,
	IconBrandX,
	IconBrandBluesky,
	IconBrandLinktree,
} from "@tabler/icons-react-native";

export interface KnownSocial {
	title: string;
	url: string;
	icon: ElementType;
};

export const KnownSocials: Record<string, KnownSocial> = {
	i: { title: "Instagram", url: "https://instagram.com/$", icon: IconBrandInstagram },
	d: { title: "Discord", url: "https://discord.com/users/$", icon: IconBrandDiscord },
	t: { title: "TikTok", url: "https://tiktok.com/@$", icon: IconBrandTiktok },
	x: { title: "X / Twitter", url: "https://x.com/$", icon: IconBrandX },
	b: { title: "BlueSky", url: "https://bsky.app/profile/$", icon: IconBrandBluesky },
	l: { title: "LinkTree", url: "https://linktr.ee/$", icon: IconBrandLinktree },
};
