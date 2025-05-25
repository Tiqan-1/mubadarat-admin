import { Dropdown, Space } from "antd";

import useLocale from "@/framework/locales/use-locale";

import {  SvgIcon } from "../icon";
 
import type { MenuProps } from "antd";
import { LANGUAGE_MAP, type Locale } from "@/app/lang";
 

/**
 * Locale Picker
 */
export default function LocalePicker() {
	const { setLocale, locale } = useLocale();

	const menuItems: MenuProps["items"] = Object.values(LANGUAGE_MAP).map((item) => {
		return {
			key: item.locale,
			label: item.label,
			icon: <SvgIcon icon={item.icon} size="20" className="rounded-md" />,
		};
	});
	
	const menuClick = (menuInfo: any) => setLocale(menuInfo.key as Locale);

	return (
		<Dropdown
			placement="bottomRight"
			trigger={["click"]}
			menu={{ items: menuItems, onClick: menuClick  }}
		> 
			<button type="button" onClick={(e) => e.preventDefault()}>
				<Space>
					<SvgIcon icon={`ic-locale_${locale}`} size="24" className="rounded-md" />
				</Space>
			</button>
			{/* <IconButton className="h-10 w-10 hover:scale-105">
				<SvgIcon icon={`ic-locale_${locale}`} size="24" className="rounded-md" />
			</IconButton> */}
		</Dropdown>
	);
}




// export default function LocalePicker() { 
 
// 	const items: MenuProps['items'] = [
// 		{
// 		  key: '1',
// 		  label: (
// 			<a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
// 			  1st menu item
// 			</a>
// 		  ),
// 		},
// 		{
// 		  key: '2',
// 		  label: (
// 			<a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
// 			  2nd menu item (disabled)
// 			</a>
// 		  ),
// 		  icon: <SmileOutlined />,
// 		  disabled: true,
// 		},
// 		{
// 		  key: '3',
// 		  label: (
// 			<a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
// 			  3rd menu item (disabled)
// 			</a>
// 		  ),
// 		  disabled: true,
// 		},
// 		{
// 		  key: '4',
// 		  danger: true,
// 		  label: 'a danger item',
// 		},
// 	  ];
	  
	
// 		return (
// 			<Dropdown menu={{ items }}>
// 			  {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
// 				<a onClick={(e) => e.preventDefault()}>
// 				<Space>
// 				  Hover me
// 				  <DownOutlined />
// 				</Space>
// 			  </a>
// 			</Dropdown>
// 		);
// 	}