import Logo from "@/assets/images/logo.png";
import Router from "@/framework/router/index";

import { ThemeProvider } from "@/framework/theme/theme-provider";
import { UIAdapter } from "@/app/ui/adapter";
import { MotionLazy } from "@/app/ui/components/animate/motion-lazy";
import ProgressBar from "@/app/ui/components/progress-bar";
import Toast from "@/app/ui/components/toast";
// import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";

function App() {
	return (
		<Suspense>
			<ProgressBar />
			{/* <Analytics /> */}
			<ThemeProvider adapters={[UIAdapter]}>
				<MotionLazy>
					<title>{import.meta.env.VITE_APP_NAME}</title>
					<link rel="icon" href={Logo} />
					<Toast />

					<Router />
				</MotionLazy>
			</ThemeProvider>
		</Suspense>
	);
}

export default App;
