export const QR_BASE = "https://cos.tsx.lt";

const stripUrlPrefix = (data: string): string => {
	if (!data.startsWith(QR_BASE)) return data;
	let rest = data.slice(QR_BASE.length);
	// Allow optional trailing slash before the hash
	if (rest.startsWith("/")) rest = rest.slice(1);
	if (!rest.startsWith("#")) return data;
	return rest.slice(1);
};

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

const safeDecode = (s: string | undefined): string => {
	if (!s) return s ?? "";
	try {
		return decodeURIComponent(s);
	} catch {
		return s;
	}
};

const OUTER_SEPARATOR = "|";
const INNER_SEPARATOR = ",";
const INNER_KV_SEPARATOR = ":";

export const parsePayload = (data: string): Payload => {
	const inner = stripUrlPrefix(data);
	const [v, name, soc, details] = inner.split(OUTER_SEPARATOR);

	if (v !== "0") throw new Error("Unsupported payload version");

	const socials: Record<string, string> = {};
	if (soc) {
		for (const s of soc.split(INNER_SEPARATOR)) {
			if (!s) continue;
			const colon = s.indexOf(INNER_KV_SEPARATOR);
			if (colon === -1) continue;
			const k = s.slice(0, colon);
			const v = s.slice(colon + 1);
			if (k) socials[k] = safeDecode(v);
		}
	}

	return { name: safeDecode(name), socials, details: safeDecode(details) };
};

export const isEmptyPayload = (payload: Payload): boolean => {
	return (
		!payload.name.trim() &&
		Object.values(payload.socials).every((v) => !v.trim()) &&
		!payload.details.trim()
	);
};

export const serializePayload = (payload: Payload): string => {
	return (
		QR_BASE +
		"#" +
		[
			"0",
			encodeURIComponent(payload.name),
			Object.entries(payload.socials)
				.filter(([, v]) => !!v)
				.sort(([k1], [k2]) => k1.localeCompare(k2))
				.map(([k, v]) => `${k}:${encodeURIComponent(v)}`)
				.join(","),
			encodeURIComponent(payload.details),
		].join("|")
	);
};

export const sanitizePayload = (payload: Payload): Payload => {
	const sanitize = (s: string) => s.trim().replace(/[|:,]/g, "");

	return {
		name: sanitize(payload.name),
		socials: Object.fromEntries(
			Object.entries(payload.socials)
				.filter(([, v]) => !!v.trim())
				.map(([k, v]) => [k, sanitize(v)]),
		),
		details: sanitize(payload.details),
	};
};
