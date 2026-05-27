import { DimensionValue, FlexStyle, View, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

export type SpacingName = "xs" | "sm" | "md" | "lg" | "xl";
export type Spacing = SpacingName | DimensionValue;

export interface BoxProps extends ViewProps {
	w?: DimensionValue;
	h?: DimensionValue;
	pos?: FlexStyle["position"];
	t?: DimensionValue;
	r?: DimensionValue;
	b?: DimensionValue;
	l?: DimensionValue;

	p?: Spacing;
	px?: Spacing;
	py?: Spacing;
	pt?: Spacing;
	pr?: Spacing;
	pb?: Spacing;
	pl?: Spacing;

	m?: Spacing;
	mx?: Spacing;
	my?: Spacing;
	mt?: Spacing;
	mr?: Spacing;
	mb?: Spacing;
	ml?: Spacing;
};

const SPACING: Record<SpacingName, number> = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
};

const getSpacingValue = (spacing: Spacing | undefined): DimensionValue | undefined =>
	SPACING[spacing as SpacingName] ?? spacing;

export const Box = (props: BoxProps) => {
	const theme = useTheme();

	const style: FlexStyle = {};

	const dir = {
		l: "Left",
		r: "Right",
		t: "Top",
		b: "Bottom",
		x: "Horizontal",
		y: "Vertical",
	} as const;

	for (const key in props) switch (true) {
		case key == "w": style.width = props.w; break;
		case key == "h": style.height = props.h; break;
		case key == "pos": style.position = props.pos; break;

		case key[0] == "p": {
			const suffix = key.slice(1) as keyof typeof dir;
			if (dir[suffix]) style[`padding${dir[suffix]}`] = getSpacingValue(props[key as keyof BoxProps] as Spacing);
			else if (key == "p") style.padding = getSpacingValue(props.p);
		} break;

		case key[0] == "m": {
			const suffix = key.slice(1) as keyof typeof dir;
			if (dir[suffix]) style[`margin${dir[suffix]}`] = getSpacingValue(props[key as keyof BoxProps] as Spacing);
			else if (key == "m") style.margin = getSpacingValue(props.m);
		} break;
	}

	return (
		<View
			{...props}
			style={[
				style,
				props.style,
			]}
		/>
	)
};

export interface FlexProps extends BoxProps {
	gap?: Spacing;
	direction?: FlexStyle["flexDirection"];
	justify?: FlexStyle["justifyContent"];
	align?: FlexStyle["alignItems"];
}

export const Flex = (props: FlexProps) => {
	return (
		<Box
			{...props}
			style={[
				{
					flexDirection: props.direction,
					gap: getSpacingValue(props.gap) as any,
					justifyContent: props.justify,
					alignItems: props.align,
				},
				props.style,
			]}
		/>
	)
};
