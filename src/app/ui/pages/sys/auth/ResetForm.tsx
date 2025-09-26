import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

import { SvgIcon } from "@/app/ui/components/icon";

import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/app/api/services/auth";
import { toast } from "sonner";

function ResetForm() {

	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
		resetMutation.mutate(values);
	};

	const { t } = useTranslation();
	const { loginState, backToLogin } = useLoginStateContext();
	
	
	const resetMutation = useMutation({
		mutationFn: (data:any) => {
			return authApi.resetPassword(data);
		},
		onSuccess() { 
            toast.success(t('sys.login.passwordChangedSuccessfuly'));
			backToLogin();
		},
	})

	if (loginState !== LoginStateEnum.RESET_PASSWORD) return null;

	return (
		<>
			<div className="mb-8 text-center">
				<SvgIcon icon="ic-reset-password" size="100" />
			</div>
			<div className="mb-4 text-center text-2xl font-bold xl:text-3xl">{t("sys.login.resetFormTitle")}</div>
			<Form name="normal_login" size="large" initialValues={{ remember: true }} onFinish={onFinish}>
				<p className="mb-4 h-12 text-center text-gray">{t("sys.login.forgetFormSecondTitle")}</p>
				
				<Form.Item name="email" rules={[{ required: true, message: t("sys.login.emailPlaceholder") }]}>
					<Input placeholder={t("sys.login.email")} />
				</Form.Item>
				
				<Form.Item name="code" rules={[{ required: true, message: t("sys.login.resetCodePlaceholder") }]}>
					<Input placeholder={t("sys.login.resetCode")} />
				</Form.Item>

				<Form.Item name="password" rules={[
					{ required: true, message: t("sys.login.passwordPlaceholder") },
					{ min: 6, max:50 }
				]}>
					<Input.Password type="password" placeholder={t("sys.login.password")} />
				</Form.Item>
				<Form.Item
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: t("sys.login.confirmPasswordPlaceholder"),
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("password") === value) {
									return Promise.resolve();
								}
								return Promise.reject(new Error(t("sys.login.diffPwd")));
							},
						}),
					]}
				>
					<Input.Password type="password" placeholder={t("sys.login.confirmPassword")} />
				</Form.Item>



				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full !bg-black">
						{t("sys.login.resetButtonTitle")}
					</Button>
				</Form.Item>

				<ReturnButton onClick={backToLogin} />
			</Form>
		</>
	);
}

export default ResetForm;
