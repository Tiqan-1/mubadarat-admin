 
import ar_EG from "./ar_EG";
import en_US from "./en_US";
import zh_CN from "./zh_CN";
import { Language } from "@/framework/locales/use-locale";

export type Locale = keyof typeof LocalEnum;
export enum LocalEnum {
	en_US = "en_US",
	ar_EG = "ar_EG",
	zh_CN = "zh_CN",
}


export const LANGUAGE_MAP: Record<Locale, Language> = {
    [LocalEnum.ar_EG]: {
        locale: LocalEnum.ar_EG,
        label: "العربية",
        icon: "ic-locale_ar_EG",
        direction: "rtl",
    },
    [LocalEnum.zh_CN]: {
        locale: LocalEnum.zh_CN,
        label: "中国人",
        icon: "ic-locale_zh_CN",
        direction: "ltr",
    },
    [LocalEnum.en_US]: {
        locale: LocalEnum.en_US,
        label: "English",
        icon: "ic-locale_en_US",
        direction: "ltr",
    },
};

export default {
    ar_EG: { translation: ar_EG },
    en_US: { translation: en_US },
    zh_CN: { translation: zh_CN },
};