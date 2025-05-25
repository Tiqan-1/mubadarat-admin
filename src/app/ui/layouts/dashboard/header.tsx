import { Drawer, Space } from "antd";
import { type CSSProperties, useState } from "react";

import { useSettings } from "@/framework/store/settingStore";
import { IconButton,  SvgIcon } from "@/app/ui/components/icon";
import LocalePicker from "@/app/ui/components/locale-picker";
import Logo from "@/app/ui/components/logo";

import AccountDropdown from "../components/account-dropdown";
import BreadCrumb from "../components/bread-crumb";
// import NoticeButton from "../components/notice";
import SearchBar from "../components/search-bar";
import SettingButton from "../components/setting-button";

import { themeVars } from "@/framework/theme/theme.css";
import { ThemeLayout } from "@/framework/types/enum";
import { cn } from "@/framework/utils";
import { rgbAlpha } from "@/framework/utils/theme";
import { HEADER_HEIGHT, NAV_COLLAPSED_WIDTH, NAV_WIDTH } from "./config";
import NavVertical from "./nav/nav-vertical";

export default function Header() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { direction, themeLayout, breadCrumb } = useSettings();

	const headerStyle: CSSProperties = {
		borderBottom:
			themeLayout === ThemeLayout.Horizontal
				? `1px dashed ${rgbAlpha(themeVars.colors.palette.gray["500Channel"], 0.2)}`
				: "",
		backgroundColor: rgbAlpha(themeVars.colors.background.defaultChannel, 0.9),
		width: "100%",
	};

	const headerDirection = direction === "ltr" ? "right-0 left-auto" : "left-0 right-auto";
	return (
		<>
			<header
				className={cn(themeLayout === ThemeLayout.Horizontal ? "relative" : `sticky top-0 ${headerDirection}`)}
				style={headerStyle}
			>
				<div
					className="flex flex-grow items-center justify-between px-4 text-gray backdrop-blur xl:px-6 2xl:px-10"
					style={{
						height: HEADER_HEIGHT,
						transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
					}}
				>
					<div className="flex items-baseline">
						{themeLayout !== ThemeLayout.Horizontal ? (
							<IconButton onClick={() => setDrawerOpen(true)} className="h-10 w-10 md:hidden">
								<SvgIcon icon="ic-menu" size="24" />
							</IconButton>
						) : (
							<Logo />
						)}
						<div className="ml-4 hidden md:block">{breadCrumb ? <BreadCrumb /> : null}</div>
					</div>

					<Space size="middle">
						<SearchBar />
						<LocalePicker />
						{/* TODO: ADD NOTIFS */}
						{/* <NoticeButton /> */}
						<SettingButton />
						<AccountDropdown />
					</Space>
				</div>
			</header>
			<Drawer
				placement={direction === "ltr" ? "left" : "right"}
				onClose={() => setDrawerOpen(false)}
				open={drawerOpen}
				closeIcon={false}
				width={themeLayout === ThemeLayout.Mini ? NAV_COLLAPSED_WIDTH : NAV_WIDTH}
			>
				<NavVertical closeSideBarDrawer={() => setDrawerOpen(false)} />
			</Drawer>
		</>
	);
}
