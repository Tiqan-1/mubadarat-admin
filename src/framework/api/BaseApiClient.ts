import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";

import { t } from "@/framework/locales/i18n";
import userStore from "@/framework/store/userStore";

import type { Result } from "@/framework/types/api"; 
import { toast } from "sonner"; 
 
export function _cleanParams(params:{ [key: string]: any }) {
	// console.log('dirty', params);
	const o = Object.entries(params).reduce((a: { [key: string]: any },[k,v]) => {
		// return (v == null ? a : (a[k]=v, a));
		if(v == null || v === ''){
			return a ;
		}
		a[k]=v;
		return a;
	}, {});
	// console.log('clean', o);
	return o
}
export function _route(url:string, params:{ [key: string]: any }){
	return Object.keys(params).reduce((prev, key) => prev.replace(`:${key}`, params[key].toString()), url)
}

export interface PaginationResponse<T>{
	items: T[]
	page: number
	pageSize: number
	total: number
  }

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

// Request interception
axiosInstance.interceptors.request.use(
	(config) => {
		// Do something before the request is sent 
		const { accessToken } = userStore.getState().userToken;
		// console.log(accessToken ?? "NO ACCESS TOJEN");
		config.headers.Authorization = `Bearer ${accessToken}`;
		return config;
	},
	(error) => {
		// What to do when a request fails
		return Promise.reject(error);
	},
);

// Response Interception
axiosInstance.interceptors.response.use(
	(res: AxiosResponse) => {
		if (!res.data && res.status!==204) throw new Error(t("sys.api.apiRequestFailed"));

		return res.data;

		// const { status, data, message } = res.data;

		// const hasSuccess = data && Reflect.has(res.data, "status") && status === ResultEnum.SUCCESS;
		// if (hasSuccess) {
		// 	return data;
		// }

		// throw new Error(message || t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<Result>) => {
		const { response, message } = error || {};

		let errMsg = response?.data?.message || message || t("sys.api.errorMessage");

		if(Array.isArray(errMsg)){
			errMsg = errMsg.reduce((accumulator, currentValue) => `${accumulator} | ${currentValue}`, "");
		}
		
		toast.error(errMsg, {
			position: "top-center",
		});

		const status = response?.status;
		if (status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "GET" });
	}

	post<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "POST" });
	}

	put<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT" });
	}

	patch<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PATCH" });
	}

	delete<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "DELETE" });
	}

	request<T = any>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			axiosInstance
				.request<any, AxiosResponse<Result>>(config)
				.then((res: AxiosResponse<Result>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
}
export default new APIClient();
