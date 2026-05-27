import { TextInput as NativeTextInput, TextInputProps as RNTextInputProps } from "react-native";
import { HelperText, Text, useTheme } from "react-native-paper";
import { Flex } from "./layouting";

export interface TextInputProps extends RNTextInputProps {
	label?: string;
	description?: string;
	error?: string;
	placeholder?: string;
	autoFocus?: boolean;
};

export const TextInput = (props: TextInputProps) => {
	const theme = useTheme();

	return (
		<Flex
			direction="column"
			gap="xs"
			w="100%"
		>
			<Flex direction="column" gap={0}>
				<Text style={{ fontWeight: "700" }}>
					{props.label}
				</Text>
				{props.description && (
					<Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
						{props.description}
					</Text>
				)}
			</Flex>
			<NativeTextInput
				placeholder={props.placeholder}
				placeholderTextColor={theme.colors.onSurfaceDisabled}
				{...props}
				style={[
					{
						width: "100%",
						backgroundColor: theme.colors.surface,
						outlineColor: props.error ? theme.colors.error : theme.colors.primary,
						color: theme.colors.onSurfaceVariant,
						borderRadius: theme.roundness,
						paddingHorizontal: 12,
						paddingVertical: 8,
						fontSize: 16,
						fontFamily: theme.fonts.bodyMedium.fontFamily,
					},
					props.style,
				]}
			/>
			<HelperText type="error" visible={!!props.error}>
				{props.error}
			</HelperText>
		</Flex>
	);
};

