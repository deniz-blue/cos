import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";

export const useA11yAutoFocus = () => {
	const ref = useRef(null);

	useFocusEffect(
		useCallback(() => {
			if (!ref.current) return;
			const node = findNodeHandle(ref.current);
			if (!node) return;
			setTimeout(() => {
				AccessibilityInfo.setAccessibilityFocus(node);
			}, 100);
		}, [ref]),
	);

	return ref;
};
