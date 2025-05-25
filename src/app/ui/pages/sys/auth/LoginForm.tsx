import { Button, Col, Divider, Form, Input, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next"; 

import type { SignInReq } from "@/app/api/services/auth";
import { useSignIn } from "@/framework/store/userStore";

import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";

function LoginForm() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const { loginState, setLoginState } = useLoginStateContext();
	const signIn = useSignIn();

	if (loginState !== LoginStateEnum.LOGIN) return null;

	const handleFinish = async ({ email, password }: SignInReq) => {
		setLoading(true);
		try {
			await signIn({ email, password });
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<div className="mb-4 text-2xl font-bold xl:text-3xl">{t("sys.login.signInFormTitle")}</div>
			<Form
				name="login"
				size="large"
				onFinish={handleFinish}
			>
				<div className="mb-4 flex flex-col">
					{/* <Alert
						description={
							<div className="flex flex-col">
								<div className="flex">
									<span className="flex-shrink-0 text-text-disabled">{t("sys.login.userName")}:</span>
									<span className="ml-1 text-text-secondary">
										{DEFAULT_USER.username} / {TEST_USER.username}
									</span>
								</div>
								<div className="flex">
									<span className="flex-shrink-0 text-text-disabled">{t("sys.login.password")}:</span>
									<span className="ml-1 text-text-secondary">{DEFAULT_USER.password}</span>
								</div>
							</div>
						}
						showIcon
					/> */}
				</div>

				<Form.Item name="email" rules={[
					{ required: true, message: t("sys.login.emailPlaceholder") },
					{ type: 'email', message: t("sys.login.emailValidation") }
				]}>
					<Input type="email" placeholder={t("sys.login.email")} />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: t("sys.login.passwordPlaceholder") }]}>
					<Input.Password type="password" placeholder={t("sys.login.password")} />
				</Form.Item>
				{/* <Form.Item>
					<Row align="middle">
						<Col span={12}>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>{t("sys.login.rememberMe")}</Checkbox>
							</Form.Item>
						</Col>
						<Col span={12} className="text-right">
							<Button
								type="link"
								className="!underline"
								onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
								size="small"
							>
								{t("sys.login.forgetPassword")}
							</Button>
						</Col>
					</Row>
				</Form.Item> */}
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full" loading={loading}>
						{t("sys.login.loginButton")}
					</Button>
				</Form.Item>

				<Divider className="!text-xs" /> 
				

				<Row align="middle" gutter={8}>
					<Col span={24} flex="1" onClick={() => setLoginState(LoginStateEnum.REGISTER)}>
						<Button className="w-full !text-sm">{t("sys.login.signUpFormTitle")}</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

export default LoginForm;
