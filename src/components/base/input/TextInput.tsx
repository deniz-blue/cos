import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
	Pressable,
	TextInput as RNTextInput,
	type TextInputProps as RNTextInputProps,
} from "react-native";
import { Colors } from "../../../theme/colors";
import { ControlHeight, FontSize } from "../../../theme/sizing";
import { Spacing } from "../../../theme/spacing";
import { BoxProps } from "../Box";
import { InputBase } from "./InputBase";
import { InputWrapper, type InputWrapperProps } from "./InputWrapper";

const INPUT_SIZES = {
	sm: { h: ControlHeight.sm, fz: FontSize.xs },
	md: { h: ControlHeight.md, fz: FontSize.sm },
	lg: { h: ControlHeight.lg, fz: FontSize.md },
} as const;

export interface TextInputProps
	extends
		Omit<RNTextInputProps, "placeholderTextColor">,
		Pick<InputWrapperProps, "label" | "description" | "error"> {
	size?: keyof typeof INPUT_SIZES;
	leftSection?: ReactNode;
	rightSection?: ReactNode;
	baseProps?: Omit<BoxProps, "children">;
}

export const TextInput = ({
	label,
	description,
	error,
	size = "md",
	leftSection,
	rightSection,
	style,
	baseProps: { style: baseStyle, ...baseProps } = {},
	...rest
}: TextInputProps) => {
	const id = useMemo(() => Math.random().toString(36).slice(2), []);
	const inputSize = INPUT_SIZES[size];
	const [focused, setFocused] = useState(false);
	const ref = useRef<RNTextInput | null>(null);

	const handleFocus = useCallback(
		(e: any) => {
			setFocused(true);
			rest.onFocus?.(e);
		},
		[rest.onFocus],
	);

	const handleBlur = useCallback(
		(e: any) => {
			setFocused(false);
			rest.onBlur?.(e);
		},
		[rest.onBlur],
	);

	const input = (
		<RNTextInput
			placeholderTextColor={Colors.TextDimmed}
			ref={ref}
			style={[
				{
					flex: 1,
					height: "100%",
					color: Colors.Text,
					backgroundColor: "transparent",
					paddingVertical: Spacing.xs,
					fontSize: inputSize.fz,
					fontFamily: "Lexend",
					outlineWidth: 0,
					outlineColor: "transparent",
				},
				style,
			]}
			{...rest}
			onFocus={handleFocus}
			onBlur={handleBlur}
			accessibilityLabelledBy={id}
			aria-labelledby={id}
			maxLength={/* 64kb fallback */ 65536}
		/>
	);

	return (
		<InputWrapper
			label={label}
			description={description}
			error={error}
			wrapperProps={{
				accessible: true,
				nativeID: id,
				id,
			}}
		>
			<InputBase<typeof Pressable>
				component={Pressable}
				focused={focused}
				size={size}
				gap={leftSection || rightSection ? Spacing.sm : undefined}
				px="sm"
				style={[
					{
						borderWidth: 1,
						borderColor: error ? "#f44336" : "transparent",
					},
					baseStyle,
				]}
				onPress={() => ref.current?.focus()}
				tabIndex={-1}
				{...baseProps}
			>
				{leftSection}
				{input}
				{rightSection}
			</InputBase>
		</InputWrapper>
	);
};
