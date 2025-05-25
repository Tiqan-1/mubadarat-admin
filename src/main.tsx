// react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ReactDOM from "react-dom/client";
// // svg icons
import 'virtual:svg-icons/register'
// i18n
import "@/framework/locales/i18n";
// css
import "@/app/ui/adapter/global.css";
import "@/framework/theme/theme.css";
  
import App from "@/app/ui/App";
  
// // mock api
// import worker from "@/framework/mock";
// // 🥵 start service worker mock in development mode
// worker.start({ onUnhandledRequest: "bypass" });

async function enableMocking() {
	if (import.meta.env.VITE_MOCK_ENABLED !== 'true') {
		return Promise.resolve();
	}
	const worker = await import("@/framework/mock");
	return worker.default.start();
} 
enableMocking().then(()=>{
	const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

	root.render( 
		<QueryClientProvider client={new QueryClient()}>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */} 
			<App />
		</QueryClientProvider> ,
	);
})
 