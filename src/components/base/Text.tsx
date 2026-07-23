import type { TextStyle } from "react-native";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { Colors, getThemeColor, type ThemeColor } from "../../theme/colors";
import { FontSize } from "../../theme/sizing";

export interface TextProps extends RNTextProps {
	c?: ThemeColor;
	fz?: number;
	fw?: TextStyle["fontWeight"];
	fst?: TextStyle["fontStyle"];
	ta?: TextStyle["textAlign"];
	tt?: TextStyle["textTransform"];
	tdl?: TextStyle["textDecorationLine"];
	lh?: number;
	ref?: React.Ref<RNText>;
}

export const Text = (props: TextProps) => {
	const {
		c,
		fz,
		fw,
		fst,
		ta,
		tt,
		tdl,
		lh,
		style,
		...rest
	} = props;

	if (!rest.children) return null;

	return (
		<RNText
			style={[
				{
					fontFamily: "Lexend",
					color: c ? getThemeColor(c) : Colors.Text,
					fontSize: fz ?? FontSize.md,
					fontWeight: fw,
					fontStyle: fst,
					textAlign: ta,
					textTransform: tt,
					textDecorationLine: tdl,
					lineHeight: lh,
				},
				style,
			]}
			{...rest}
		/>
	);
};
