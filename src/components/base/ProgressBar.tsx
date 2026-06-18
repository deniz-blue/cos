import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, View } from "react-native";
import { Colors } from "../../theme/colors";

const INDETERMINATE_DURATION = 2000;
const INDETERMINATE_MAX_WIDTH = 0.6;

export const ProgressBar = () => {
	const timer = useRef(new Animated.Value(0)).current;
	const fade = useRef(new Animated.Value(0)).current;
	const [width, setWidth] = useState(0);

	useEffect(() => {
		// Fade in
		Animated.timing(fade, {
			duration: 200,
			toValue: 1,
			useNativeDriver: true,
		}).start();

		// Indeterminate: manually chain to guarantee looping
		timer.setValue(0);
		let stopped = false;
		const tick = () => {
			if (stopped) return;
			timer.setValue(0);
			Animated.timing(timer, {
				duration: INDETERMINATE_DURATION,
				toValue: 1,
				useNativeDriver: true,
			}).start(({ finished }) => {
				if (finished && !stopped) tick();
			});
		};
		tick();

		return () => {
			stopped = true;
		};
	}, [timer, fade]);

	const onLayout = (e: LayoutChangeEvent) => {
		setWidth(e.nativeEvent.layout.width);
	};

	const progressBarStyle = width > 0 ? {
		transform: [
			{
				translateX: timer.interpolate({
					inputRange: [0, 0.5, 1],
					outputRange: [
						-0.5 * width,
						-0.5 * INDETERMINATE_MAX_WIDTH * width,
						0.7 * width,
					],
				}),
			},
			{
				scaleX: timer.interpolate({
					inputRange: [0, 0.5, 1],
					outputRange: [0.0001, INDETERMINATE_MAX_WIDTH, 0.0001],
				}),
			},
		],
	} : {};

	return (
		<View
			onLayout={onLayout}
			style={{ width: "100%" }}
		>
			<Animated.View
				style={[
					containerStyle,
					{
						backgroundColor: Colors.Dark5,
						opacity: fade,
					},
				]}
			>
				{width > 0 && (
					<Animated.View
						style={[
							fillStyle,
							{
								backgroundColor: Colors.Primary,
							},
							progressBarStyle,
						]}
					/>
				)}
			</Animated.View>
		</View>
	);
};

const containerStyle: any = {
	height: 4,
	overflow: "hidden",
};

const fillStyle: any = {
	flex: 1,
};
