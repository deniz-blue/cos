const DEV = process.env.APP_VARIANT === "development";

const version = "1.0.3";
const versionCode = 3;

const blockedPermissions = [
	"android.permission.INTERNET",
	"android.permission.READ_EXTERNAL_STORAGE",
	"android.permission.RECORD_AUDIO",
	"android.permission.SYSTEM_ALERT_WINDOW",
	"android.permission.WRITE_EXTERNAL_STORAGE",
];

console.log(`Expo Config: ${DEV ? "development" : "production"} variant`);

export default {
	/** @type {import("expo/config").ExpoConfig} */
	expo: {
		name: DEV ? "CosQR (Development)" : "CosQR",
		version,
		orientation: "portrait",
		icon: "./public/maskable-icon.png",
		scheme: "cos",
		userInterfaceStyle: "dark",
		android: {
			package: DEV ? "lt.tsx.cos.dev" : "lt.tsx.cos",
			predictiveBackGestureEnabled: false,
			versionCode,
			blockedPermissions: DEV ? [] : blockedPermissions,
			intentFilters: [
				{
					autoVerify: true,
					action: "VIEW",
					data: [
						{
							scheme: "https",
							host: "cos.tsx.lt",
						},
					],
					category: ["BROWSABLE", "DEFAULT"],
				},
			],
		},
		web: {
			output: "single",
			favicon: "./public/maskable-icon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-font",
				{
					fonts: ["./public/fonts/Lexend_400Regular.ttf"],
				},
			],
			[
				"expo-splash-screen",
				{
					backgroundColor: "#000000",
					android: {
						image: "./public/splash.png",
						resizeMode: "contain",
						backgroundColor: "#000000",
						imageWidth: 578,
					},
				},
			],
			"expo-status-bar",
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
		},
		extra: {
			router: {},
		},
	},
};
