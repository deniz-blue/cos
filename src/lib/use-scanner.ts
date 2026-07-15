import { BarcodeScanningResult } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Vibration } from "react-native";
import { parsePayload, type Payload } from "./payload";
import { useListMutation } from "./useListMutation";

export type ScanMessage = {
	id: string;
	type: "added" | "exists";
	payload: Payload;
};

export type ErrorMessage = {
	id: "error";
	type: "error";
};

export type QueueMessage = ScanMessage | ErrorMessage;

const MESSAGE_TIMEOUT = 3000;

export const useTimeoutMap = () => {
	const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
	useEffect(() => {
		return () => {
			for (const t of timeouts.current.values()) clearTimeout(t);
			timeouts.current.clear();
		};
	}, []);
	return timeouts;
};

export const useScanner = () => {
	const [messages, setMessages] = useState<QueueMessage[]>([]);
	const timeouts = useTimeoutMap();
	const mut = useListMutation();

	const scheduleDismiss = useCallback((id: string) => {
		const t = setTimeout(() => {
			setMessages((p) => p.filter((msg) => msg.id !== id));
			timeouts.current.delete(id);
		}, MESSAGE_TIMEOUT);
		timeouts.current.set(id, t);
	}, []);

	const resetTimer = useCallback(
		(id: string) => {
			const existing = timeouts.current.get(id);
			if (existing) clearTimeout(existing);
			scheduleDismiss(id);
		},
		[scheduleDismiss],
	);

	const dismiss = useCallback((id: string) => {
		const t = timeouts.current.get(id);
		if (t) {
			clearTimeout(t);
			timeouts.current.delete(id);
		}
		setMessages((m) => m.filter((msg) => msg.id !== id));
	}, []);

	const handleScan = useCallback(async (res: BarcodeScanningResult) => {
		try {
			const payload = parsePayload(res.data);
			const result = await mut.mutateAsync({ type: "add", item: { payload, note: "" } });
			if (!result) return;

			if (result.type === "added") {
				Vibration.vibrate(50);
				AccessibilityInfo.announceForAccessibility(`Scanned ${payload.name}`);
			}

			setMessages((prev) => {
				const existing = prev.find((m) => m.id === result.id);
				if (existing) {
					resetTimer(existing.id);
					return prev;
				}

				if (result.type === "exists") {
					AccessibilityInfo.announceForAccessibility(`${payload.name} already exists`);
				}

				scheduleDismiss(result.id);
				return [...prev, { id: result.id, type: result.type, payload }];
			});
		} catch (e) {
			console.log("Failed to parse QR code data", e);
			AccessibilityInfo.announceForAccessibility("Failed to parse QR code data");
			setMessages((prev) => {
				const existing = prev.find((m) => m.id === "error");
				if (existing) {
					resetTimer(existing.id);
					return prev;
				}
				scheduleDismiss("error");
				return [...prev, { id: "error", type: "error" }];
			});
		}
	}, []);

	return { messages, dismiss, handleScan };
};
