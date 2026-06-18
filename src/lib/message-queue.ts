import { useCallback, useEffect, useRef, useState } from "react";
import type { Payload } from "./payload";
import { uid } from "./uid";

export type ScanMessage = {
	id: string;
	itemId: string;
	type: "added" | "exists";
	payload: Payload;
};

export type ErrorMessage = {
	id: string;
	type: "error";
	text: string;
};

export type QueueMessage = ScanMessage | ErrorMessage;

const MESSAGE_TIMEOUT = 3000;

export const useMessageQueue = () => {
	const [messages, setMessages] = useState<QueueMessage[]>([]);
	const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	useEffect(() => {
		return () => {
			for (const t of timeouts.current.values()) clearTimeout(t);
			timeouts.current.clear();
		};
	}, []);

	const scheduleDismiss = useCallback((id: string) => {
		const t = setTimeout(() => {
			setMessages(p => p.filter(msg => msg.id !== id));
			timeouts.current.delete(id);
		}, MESSAGE_TIMEOUT);
		timeouts.current.set(id, t);
	}, []);

	const resetTimer = useCallback((id: string) => {
		const existing = timeouts.current.get(id);
		if (existing) clearTimeout(existing);
		scheduleDismiss(id);
	}, [scheduleDismiss]);

	const pushScan = useCallback((payload: Payload, type: ScanMessage["type"], itemId: string) => {
		const payloadKey = JSON.stringify(payload);
		const id = uid();

		setMessages(prev => {
			const existing = prev.find(msg =>
				msg.type !== "error" && JSON.stringify(msg.payload) === payloadKey
			);

			if (existing) {
				resetTimer(existing.id);
				return prev;
			}

			scheduleDismiss(id);
			return [...prev, { id, type, payload, itemId }];
		});

		return id;
	}, [scheduleDismiss, resetTimer]);

	const pushError = useCallback((text: string) => {
		const id = uid();

		setMessages(prev => {
			const existing = prev.find(msg =>
				msg.type === "error" && msg.text === text
			);

			if (existing) {
				resetTimer(existing.id);
				return prev;
			}

			scheduleDismiss(id);
			return [...prev, { id, type: "error", text }];
		});

		return id;
	}, [scheduleDismiss, resetTimer]);

	const dismiss = useCallback((id: string) => {
		const t = timeouts.current.get(id);
		if (t) {
			clearTimeout(t);
			timeouts.current.delete(id);
		}
		setMessages(m => m.filter(msg => msg.id !== id));
	}, []);

	return { messages, pushScan, pushError, dismiss };
};
