export interface KnownSocial {
	title: string;
	url: string;
	icon: string;
};

export const KnownSocials: Record<string, KnownSocial> = {
	i: {
		title: "Instagram",
		url: "https://instagram.com/$",
		icon: "instagram",
	},
	d: {
		title: "Discord",
		url: "https://discord.com/users/$",
		icon: "discord",
	},
	t: {
		title: "TikTok",
		url: "https://tiktok.com/@$",
		icon: "tiktok",
	},
	x: {
		title: "X / Twitter",
		url: "https://x.com/$",
		icon: "twitter",
	},
	b: {
		title: "BlueSky",
		url: "https://bsky.app/profile/$",
		icon: "bluesky",
	},
	l: {
		title: "LinkTree",
		url: "https://linktr.ee/$",
		icon: "link",
	},
};
