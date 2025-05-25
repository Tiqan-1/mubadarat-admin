import type { SettingsType } from "@/framework/store/settingStore";
import { FontFamilyPreset, typographyTokens } from "@/framework/theme/tokens/typography";
import { ThemeColorPresets, ThemeLayout, ThemeMode } from "@/framework/types/enum";

const initial: SettingsType = {
                themeColorPresets: ThemeColorPresets.Default,
                themeMode: ThemeMode.Light,
                themeLayout: ThemeLayout.Vertical,
                themeStretch: false,
                breadCrumb: true,
                multiTab: false,
                darkSidebar: false,
                fontFamily: FontFamilyPreset.rubik,
                fontSize: Number(typographyTokens.fontSize.sm),
                direction: "rtl",
            };

export const fixedSettnigs: Partial<SettingsType> = {
                themeColorPresets: ThemeColorPresets.Default,
                themeMode: ThemeMode.Light,
                themeLayout: ThemeLayout.Vertical,
                themeStretch: false,
                breadCrumb: true,
                multiTab: false,
                darkSidebar: false,
                fontFamily: FontFamilyPreset.rubik,
                fontSize: Number(typographyTokens.fontSize.sm),
                direction: "rtl",
            };

export default initial;