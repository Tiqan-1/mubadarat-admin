import { Layout } from "antd"; 
import { Navigate } from "react-router";
 
import DashboardImg from "@/assets/images/logo.png";
import Overlay from "@/assets/images/background/overlay.jpg";
import { useUserToken } from "@/framework/store/userStore";
import LocalePicker from "@/app/ui/components/locale-picker";

import { themeVars } from "@/framework/theme/theme.css";
import { rgbAlpha } from "@/framework/utils/theme";
import SettingButton from "@/app/ui/layouts/components/setting-button";
import LoginForm from "./LoginForm";
import MobileForm from "./MobileForm";
import QrCodeFrom from "./QrCodeForm";
import RegisterForm from "./RegisterForm";
import ResetForm from "./ResetForm";
import { LoginStateProvider } from "./providers/LoginStateProvider";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

function Login() {
	const token = useUserToken();

	if (token.accessToken) {
		// If authorized, jump to the home page
		return <Navigate to={HOMEPAGE} replace />;
	}

	const gradientBg = rgbAlpha(themeVars.colors.background.defaultChannel, 0.9);
	const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${Overlay})`;

	return (
		<Layout className="relative flex !min-h-screen !w-full !flex-row">
			<div
				className="hidden grow flex-col items-center justify-center gap-[80px] bg-center  bg-no-repeat md:flex"
				style={{
					background: bg,
				}}
			>
				<div className="mt-10 text-3xl font-bold leading-normal lg:text-4xl xl:text-5xl">{import.meta.env.VITE_APP_NAME}</div>
				<img className="max-w-[480px] xl:max-w-[560px]" src={DashboardImg} alt="" /> 
			</div>

			<div className="m-auto flex !h-screen w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[64px]">
				<LoginStateProvider>
					<LoginForm />
					<MobileForm />
					<QrCodeFrom />
					<RegisterForm />
					<ResetForm />
				</LoginStateProvider>
			</div>

			<div className="absolute right-2 top-0 flex flex-row">
				<LocalePicker />
				<SettingButton />
			</div>
		</Layout>
	);
}
export default Login;
