import type { ReactNode } from "react";
import { KeyboardAvoidingView, Pressable, Modal as RNModal } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/sizing";
import { Box } from "./Box";

export interface ModalProps {
	visible: boolean;
	onDismiss: () => void;
	children: ReactNode;
}

export const Modal = ({ visible, onDismiss, children }: ModalProps) => {
	if (!visible) return null;

	return (
		<RNModal
			visible
			transparent
			animationType="fade"
			onRequestClose={onDismiss}
			statusBarTranslucent
		>
			<Pressable
				onPress={onDismiss}
				importantForAccessibility="no"
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#00000066",
				}}
			>
				<KeyboardAvoidingView behavior="padding">
					<Pressable onPress={(e) => e.stopPropagation()} importantForAccessibility="no">
						<Box
							accessible
							bg={Colors.Background}
							radius={Radius.Default}
							p="md"
							style={{
								minWidth: 280,
								maxWidth: 400,
								elevation: 8,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.3,
								shadowRadius: 8,
							}}
						>
							{children}
						</Box>
					</Pressable>
				</KeyboardAvoidingView>
			</Pressable>
		</RNModal>
	);
};
