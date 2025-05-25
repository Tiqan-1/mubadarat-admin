import useLocale from "@/framework/locales/use-locale";
import { baseThemeTokens } from "@/framework/theme/tokens/base";
import { darkColorTokens, lightColorTokens, presetsColors } from "@/framework/theme/tokens/color";
import type { UILibraryAdapter } from "@/framework/theme/type";
import { ThemeMode } from "@/framework/types/enum";
import { StyleProvider } from "@ant-design/cssinjs";
import type { ThemeConfig } from "antd";
import { App, ConfigProvider, theme } from "antd"; 

import { useSettings } from "@/framework/store/settingStore";
import { lightShadowTokens } from "@/framework/theme/tokens/shadow";
import { darkShadowTokens } from "@/framework/theme/tokens/shadow";
import { removePx } from "@/framework/utils/theme";
import ar_EG from "antd/locale/ar_EG";
import en_US from "antd/locale/en_US";
import zh_CN from "antd/locale/zh_CN";
import { LocalEnum } from "@/app/lang";

export const AntdAdapter: UILibraryAdapter = ({ mode, children }) => {
	const { language } = useLocale();
	const { themeColorPresets, fontFamily, fontSize, direction } = useSettings();
	const algorithm = mode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm;

	const colorTokens = mode === ThemeMode.Light ? lightColorTokens : darkColorTokens;
	const shadowTokens = mode === ThemeMode.Light ? lightShadowTokens : darkShadowTokens;

	const primaryColorToken = presetsColors[themeColorPresets];

	const token: ThemeConfig["token"] = {
		colorPrimary: primaryColorToken.default,
		colorSuccess: colorTokens.palette.success.default,
		colorWarning: colorTokens.palette.warning.default,
		colorError: colorTokens.palette.error.default,
		colorInfo: colorTokens.palette.info.default,

		colorBgLayout: colorTokens.background.default,
		colorBgContainer: colorTokens.background.paper,
		colorBgElevated: colorTokens.background.default,

		wireframe: false,
		fontFamily: fontFamily,
		fontSize: fontSize,

		borderRadiusSM: removePx(baseThemeTokens.borderRadius.sm),
		borderRadius: removePx(baseThemeTokens.borderRadius.default),
		borderRadiusLG: removePx(baseThemeTokens.borderRadius.lg),
	};

	const components: ThemeConfig["components"] = {
		Breadcrumb: {
			separatorMargin: removePx(baseThemeTokens.spacing[1]),
		},
		Menu: {
			colorFillAlter: "transparent",
			itemColor: colorTokens.text.secondary,
			motionDurationMid: "0.125s",
			motionDurationSlow: "0.125s",
			darkItemBg: darkColorTokens.background.default,
		},
		Layout: {
			siderBg: darkColorTokens.background.default,
		},
		Card: {
			boxShadow: shadowTokens.card,
		},
	};

	// type Locale = keyof typeof LocalEnum; 
	// const antdLocal : Record<Locale, AntdLocal> = {
	const antdLocal = {
		[LocalEnum.ar_EG]: ar_EG,
		[LocalEnum.en_US]: en_US,
		[LocalEnum.zh_CN]: zh_CN,
	}[language.locale];

	return (
		<ConfigProvider
			direction={direction}
			locale={antdLocal}
			theme={{ algorithm, token, components }}
			tag={{
				style: {
					borderRadius: removePx(baseThemeTokens.borderRadius.md),
					fontWeight: 700,
					padding: `0 ${baseThemeTokens.spacing[1]}`,
					margin: `0 ${baseThemeTokens.spacing[1]}`,
					borderWidth: 0,
				},
			}}>
				
			<StyleProvider hashPriority="high">
				<App>{children}</App>
			</StyleProvider>
		</ConfigProvider>
	);
};
