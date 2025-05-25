import { useSettings } from "@/framework/store/settingStore";
import { ThemeLayout } from "@/framework/types/enum";
import { cn } from "@/framework/utils";
import Logo from "@/app/ui/components/logo";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { HEADER_HEIGHT } from "../config";
import { Space } from "antd";

type Props = {
	collapsed: boolean;
	onToggle: () => void;
};
export default function NavLogo({ collapsed, onToggle }: Props) {
	const { themeLayout, direction } = useSettings();

	return (
		<div style={{ height: `${HEADER_HEIGHT}px` }} className="relative flex items-center justify-center py-4">
			<Space className="flex items-center">
				
				<Logo />
				{themeLayout !== ThemeLayout.Mini && <span className="ml-2 text-xl font-bold text-primary">{import.meta.env.VITE_APP_NAME}</span>}
			</Space>
			<div
				onClick={onToggle}
				onKeyDown={onToggle}
				className={cn(
					`absolute ${direction === "ltr" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"} top-7 z-50 hidden h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full text-center md:flex border border-dashed border-border text-sm bg-bg-paper`,
				)}
			>
				{collapsed ? (
					direction === "ltr" ? (
						<RightOutlined className="text-xs text-text-disabled" />
					) : (
						<LeftOutlined className="text-xs text-text-disabled" />
					)
				) : direction === "ltr" ? (
					<LeftOutlined className="text-xs text-text-disabled" />
				) : (
					<RightOutlined className="text-xs text-text-disabled" />
				)}
			</div>
		</div>
	);
}
