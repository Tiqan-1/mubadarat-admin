import { Tag } from "antd";
import { Iconify } from "./icon";

export function NewFeatureTag() {
	return (
		<Tag color="cyan" className="!ml-2">
			<div className="flex items-center gap-1">
				<Iconify icon="solar:bell-bing-bold-duotone" size={12} />
				<span className="ms-1">NEW</span>
			</div>
		</Tag>
	);
}
