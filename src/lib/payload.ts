export type Payload = {
	name: string;
	socials: Record<string, string>;
	details: string;
};

export const createPayload = (): Payload => {
	return {
		name: "",
		socials: {},
		details: "",
	};
};

export const parsePayload = (data: string): Payload => {
	const [v, name, soc, details] = data.split("|");

	if (v !== "0") throw new Error("Unsupported payload version");

	const socials = Object.fromEntries(soc.split(",").map(s => {
		const [k, v] = s.split(":");
		return [k, v];
	}));

	return {
		name,
		socials,
		details,
	};
};

export const isEmptyPayload = (payload: Payload): boolean => {
	return !payload.name && Object.values(payload.socials).every(v => !v) && !payload.details;
};

export const serializePayload = (payload: Payload): string => {
	return [
		"0",
		payload.name,
		Object.entries(payload.socials)
			.filter(([, v]) => !!v)
			.sort(([k1], [k2]) => k1.localeCompare(k2))
			.map(([k, v]) => `${k}:${v}`)
			.join(","),
		payload.details,
	].join("|");
};
