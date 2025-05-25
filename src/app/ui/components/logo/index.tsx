import { NavLink } from "react-router";

import { useTheme } from "@/framework/theme/hooks";

import {  SvgIcon } from "../icon";

interface Props {
	size?: number | string;
}
function Logo({ size = 50 }: Props) {
	const { themeTokens } = useTheme();

	return (
		<NavLink to="/">
			<SvgIcon icon="ic-logo"   className="ant-menu-item-icon"  color={themeTokens.color.palette.primary.default} size={size} />
			{/* <Iconify icon="solar:code-square-bold" color={themeTokens.color.palette.primary.default} size={size} /> */}
		</NavLink>
	);
}

export default Logo;
