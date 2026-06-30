import * as Linking from "expo-linking";
import { useEffect, useRef } from "react";
import { addToList } from "./useListMutation";
import { parsePayload, QR_BASE } from "./payload";
import { queryClient } from "./query-client";

const processUrl = async (url: string, onPayload: (id: string) => void) => {
	const hashIndex = url.indexOf("#");
	if (hashIndex === -1) return;

	const hash = url.slice(hashIndex + 1);
	if (!hash) return;

	const fullUrl = `${QR_BASE}#${hash}`;

	let payload;
	try {
		payload = parsePayload(fullUrl);
	} catch {
		return;
	}

	const result = await addToList({ payload, note: "" });
	await queryClient.refetchQueries({ queryKey: ["items"] });
	onPayload(result.id);
};

/**
 * Monitors deep links (initial URL + ongoing events).
 * Calls `onPayload` with the saved item id when a valid QR payload is found.
 */
export const useDeepLinkPayload = (onPayload: (id: string) => void) => {
	const onPayloadRef = useRef(onPayload);
	onPayloadRef.current = onPayload;

	useEffect(() => {
		const handler = (event: Linking.EventType) => {
			processUrl(event.url, onPayloadRef.current);
		};

		const subscription = Linking.addEventListener("url", handler);

		Linking.getInitialURL().then((url) => {
			if (url) processUrl(url, onPayloadRef.current);
		});

		return () => subscription.remove();
	}, []);
};
