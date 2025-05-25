import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import authService, { type SignUpReq, type SignInReq, type SignInRes } from "@/app/api/services/auth";

import type { UserInfo, UserToken } from "@/framework/types/entity";
import { BasicStatus, StorageEnum } from "@/framework/types/enum";
import { toast } from "sonner";
import { t } from "i18next";
import { faker } from "@faker-js/faker";
import DEFAULT_PERMISSION from "@/app/routes";

// ------ PATCH ------
export const makeUser =  (res:SignInRes)  : UserInfo => ({
	id: res.id ?? "1",
	email: res.email,
	username: res.username ?? res.email.split('@')[0],
	avatar: res.avatar ?? faker.image.avatarGitHub(),
	// role: res.role ?? ADMIN_ROLE,
	permissions: res.permissions ?? DEFAULT_PERMISSION, 
	status: res.status ?? BasicStatus.ENABLE
});
// -------------------

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
	userInfo: Partial<UserInfo>;
	userToken: UserToken;
	actions: {
		setUserInfo: (userInfo: UserInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: {},
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const navigate = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: authService.signIn,
	});

	const signIn = async (data: SignInReq) => {
		try {
			const res = await signInMutation.mutateAsync(data);
			const { accessToken, refreshToken } = res;
			setUserToken({ accessToken, refreshToken });
			setUserInfo(makeUser(res));
			navigate(HOMEPAGE, { replace: true });
			toast.success(t("sys.login.loginSuccessTitle"));
		} catch (err) {
			toast.error(err.message, {
				position: "top-center",
			});
		}
	};

	return signIn;
};


export const useSignUP = () => {
	const navigate = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();

	const signUpMutation = useMutation({
		mutationFn: authService.signUp,
	});

	const signUp = async (data: SignUpReq) => {
		try {
			const res = await signUpMutation.mutateAsync(data);
			const { accessToken, refreshToken } = res;
			setUserToken({ accessToken, refreshToken });
			setUserInfo(makeUser(res));
			navigate(HOMEPAGE, { replace: true });
			toast.success(t("sys.login.signupSuccessTitle"));
		} catch (err) {
			toast.error(err.message, {
				position: "top-center",
			});
			throw err;
		}
	};

	return signUp;
};

export default useUserStore;
