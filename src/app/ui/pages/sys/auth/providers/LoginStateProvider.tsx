import {
	type PropsWithChildren,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";

export enum LoginStateEnum {
	LOGIN = 0,
	REGISTER = 1,
	FORGOT_PASSWORD = 2,
	RESET_PASSWORD = 3,
	MOBILE = 4,
	QR_CODE = 5,
}

interface LoginStateContextType {
	loginState: LoginStateEnum;
	setLoginState: (loginState: LoginStateEnum) => void;
	backToLogin: () => void;
}
const LoginStateContext = createContext<LoginStateContextType>({
	loginState: LoginStateEnum.LOGIN,
	setLoginState: () => {},
	backToLogin: () => {},
});

export function useLoginStateContext() {
	const context = useContext(LoginStateContext);
	return context;
}

export function LoginStateProvider({ children }: PropsWithChildren) {
	const [loginState, setLoginState] = useState(LoginStateEnum.LOGIN);

	function backToLogin() {
		setLoginState(LoginStateEnum.LOGIN);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const value: LoginStateContextType = useMemo(
		() => ({ loginState, setLoginState, backToLogin }),
		[loginState],
	);

	return (
		<LoginStateContext.Provider value={value}>
			{children}
		</LoginStateContext.Provider>
	);
}