import { Button, Col, Form, Input, Row } from "antd";
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
		forgotMutation.mutate(values);
	};

	const { t } = useTranslation();
	const { loginState, setLoginState, backToLogin } = useLoginStateContext();
	
	
	const forgotMutation = useMutation({
		mutationFn: (data:any) => {
			return authApi.forgotPassword({email:data.email});
		},
		onSuccess() { 
            toast.success(t('sys.login.resetCodeSentSuccessfuly'));
			setLoginState(LoginStateEnum.RESET_PASSWORD);
		},
	})

	if (loginState !== LoginStateEnum.FORGOT_PASSWORD) return null;

	return (
		<>
			<div className="mb-8 text-center">
				<SvgIcon icon="ic-reset-password" size="100" />
			</div>
			<div className="mb-4 text-center text-2xl font-bold xl:text-3xl">{t("sys.login.forgetFormTitle")}</div>
			<Form name="normal_login" size="large" initialValues={{ remember: true }} onFinish={onFinish}>
				<p className="mb-4 h-12 text-center text-gray">{t("sys.login.forgetFormSecondTitle")}</p>
				<Form.Item name="email" rules={[{ required: true, message: t("sys.login.emailPlaceholder") }]}>
					<Input placeholder={t("sys.login.email")} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full !bg-black">
						{t("sys.login.sendEmailButton")}
					</Button>
				</Form.Item>
				
				<Form.Item>
					<Row align="middle">
						<Col span={24} className="text-center">
							<Button
								type="link"
								className="!underline"
								onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
								size="small"
							>
								{t("sys.login.iHaveAResetCode")}
							</Button>
						</Col>
					</Row>
				</Form.Item>

				<ReturnButton onClick={backToLogin} />
			</Form>
		</>
	);
}

export default ResetForm;
