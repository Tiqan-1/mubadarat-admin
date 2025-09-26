import apiClient, { _route } from "@/framework/api/BaseApiClient";

import type { UserInfo, UserToken } from "@/framework/types/entity";

export interface SignInReq {
	email: string;
	password: string;
}
export interface SignUpReq extends SignInReq {
	name: string;
}

export interface ForgotReq {
	email: string;
}
export interface ResetReq{
	email: string;
	password: string;
	code: string;
}

//
export type SignInRes = UserToken & UserInfo;

export enum AuthApi {
	signIn = "/authentication/manager-login",
	signUp = "/managers/sign-up",
	signInStudent = "/authentication/login",
	signUpStudent = "/students/sign-up",
	logout = "/authentication/logout",
	refresh = "/authentication/refresh-tokens",
	
	forgot = "/authentication/forgot-password/:email",
	reset = "/authentication/change-password",
	
	//
	users = "/users",
	tokenExpired = "/user/tokenExpired",
}

const signIn = (data: SignInReq) => apiClient.post<SignInRes>({ url: AuthApi.signIn, data });
const signUp = (data: SignUpReq) => apiClient.post<SignInRes>({ url: AuthApi.signUp, data });
const signInStudent = (data: SignInReq) => apiClient.post<SignInRes>({ url: AuthApi.signInStudent, data });
const signUpStudent = (data: SignUpReq) => apiClient.post<SignInRes>({ url: AuthApi.signUpStudent, data });
const refreshTokens = (data: {refreshToken:string}) => apiClient.post<UserToken>({ url: AuthApi.refresh, data });
const logout = () => apiClient.get({ url: AuthApi.logout });
//
const forgotPassword = (data: ForgotReq) => apiClient.get({ url: _route(AuthApi.forgot, {email:data.email}), data });
const resetPassword = (data: ResetReq) => apiClient.put({ url: AuthApi.reset, data });
//
//
const users = () => apiClient.get<UserInfo[]>({ url: AuthApi.users });
const tokenExpired = () => apiClient.post({ url: AuthApi.tokenExpired });

export default {
	signIn,
	signInStudent,
	signUp,
	signUpStudent,
	refreshTokens,
	logout,
	//
	forgotPassword,
	resetPassword,
	//
	tokenExpired,
	users,
};
