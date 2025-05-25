import { Button} from "antd";
import { useSettingActions, useSettings } from "@/framework/store/settingStore";
import {  Iconify } from "@/app/ui/components/icon";

import { ThemeMode } from "@/framework/types/enum";

/**
 * App Setting
 */
export default function SettingButton() {
	const settings = useSettings();
	const {
		themeMode
	} = settings;
	const { setSettings } = useSettingActions();

	const setThemeMode = (themeMode: ThemeMode) => {
		setSettings({
			...settings,
			themeMode,
		});
	};
 
  
 
	return (
		<div className="flex items-center justify-center overflow-hidden">
			<Button  color="default" variant="text" shape="circle" icon={
				themeMode === ThemeMode.Dark ?
				<Iconify icon="solar:lightbulb-bolt-bold" size={18} /> :
				<Iconify icon="solar:lightbulb-minimalistic-broken" size={18} />
			} onClick={() => setThemeMode(themeMode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark)} /> 
		</div>
	)
}
