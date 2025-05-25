import { up } from "@/framework/hooks";
import { useMediaQuery } from "@/framework/hooks";
import { useSettings } from "@/framework/store/settingStore";
import { ThemeLayout } from "@/framework/types/enum";
import NavHorizontal from "./nav-horizontal";
import NavVertical from "./nav-vertical";

export default function Nav() {
	const { themeLayout } = useSettings();
	const isPc = useMediaQuery(up("md"));

	if (themeLayout === ThemeLayout.Horizontal) return <NavHorizontal />;

	if (isPc) return <NavVertical />;
	return null;
}
