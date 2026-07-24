import { type ReactNode } from "react";
import { Colors } from "../../../theme/colors";
import { FontSize } from "../../../theme/sizing";
import { Box, BoxProps } from "../Box";
import { Text, type TextProps } from "../Text";

export interface InputWrapperProps {
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
	labelProps?: Omit<TextProps, "children">;
	descriptionProps?: Omit<TextProps, "children">;
	wrapperProps?: Omit<BoxProps, "children">;
	errorProps?: Omit<TextProps, "children">;
	children?: ReactNode;
}

export const InputWrapper = ({
	label,
	description,
	error,
	labelProps,
	descriptionProps,
	errorProps,
	wrapperProps,
	children,
}: InputWrapperProps) => {
	const labelNode = label && (
		<Text fz={FontSize.sm} fw="bold" {...labelProps}>
			{label}
		</Text>
	);

	const descriptionNode = description && (
		<Text fz={FontSize.sm} c={Colors.TextDimmed} {...descriptionProps}>
			{description}
		</Text>
	);

	return (
		<Box gap="xs">
			{(label || description) && (
				<Box gap={0} {...wrapperProps}>
					{labelNode}
					{descriptionNode}
				</Box>
			)}

			{children}

			{error && (
				<Text fz={FontSize.sm} c={Colors.Red} {...errorProps}>
					{error}
				</Text>
			)}
		</Box>
	);
};
