import { useTranslation } from "react-i18next";
 
import { useSettingActions, useSettings } from "../store/settingStore";
import { LANGUAGE_MAP, type Locale, type LocalEnum } from "@/app/lang";

export type Language = {
	locale: keyof typeof LocalEnum;
	icon: string;
	label: string;
	direction: "ltr" | "rtl";
};


export default function useLocale() {
	const { i18n } = useTranslation();
	const settings = useSettings();
	const settingsActions = useSettingActions();

	/**
	 * localstorage -> i18nextLng change
	 */
	const setLocale = (locale: Locale) => {
		i18n.changeLanguage(locale);
		settingsActions.setSettings({...settings, direction: LANGUAGE_MAP[locale].direction})
	};

	const locale = (i18n.resolvedLanguage || import.meta.env.VITE_APP_LOCALE) as Locale;

	const language = LANGUAGE_MAP[locale];

	return {
		locale,
		language,
		setLocale,
	};
}
