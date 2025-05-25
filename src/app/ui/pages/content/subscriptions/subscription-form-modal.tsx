import { Form, Input, Modal, Select } from "antd"; 
 

import type { Subscription } from "@/app/api/services/subscriptions";
import { type JSX, useEffect } from "react";
import { t } from "i18next"; 
 

export type SubscriptionModalProps = {
	formValue: Partial<Subscription>;
	title: string;
	show: boolean;
	okDisabled: boolean;
	onOk: (id:any|undefined,formData:any) => void;
	onCancel: VoidFunction;
};

export default function SubscriptionModal({ title, show, formValue, okDisabled, onOk, onCancel }: SubscriptionModalProps) {
	const [form] = Form.useForm(); 

	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);
  
	const fileOptions : {
		value: string;
		label: JSX.Element;
	}[] = [
		{value: 'active', label: (<span>{t('app.subscriptions.statuses.active')}</span>)},
		{value: 'succeeded', label: (<span>{t('app.subscriptions.statuses.succeeded')}</span>)},
		{value: 'failed', label: (<span>{t('app.subscriptions.statuses.failed')}</span>)},
		{value: 'suspended', label: (<span>{t('app.subscriptions.statuses.suspended')}</span>)},
		{value: 'deleted', label: (<span>{t('app.subscriptions.statuses.deleted')}</span>)},
	]

	return (
		<Modal 
			forceRender={true} 
			title={title} 
			open={show} 
			okButtonProps={{ autoFocus: true, htmlType: 'submit', disabled:okDisabled }}
			okText={formValue.id === undefined ? t('common.create') : t('common.edit') }
			// onOk={onOk} 
			cancelText={t("common.cancel")}
			onCancel={onCancel}
			modalRender={(dom)=> (
				<Form 
				form={form} 
				initialValues={formValue}
				onFinish={(x)=>onOk(formValue.id, x)}
				labelCol={{ span: 6 }} 
				wrapperCol={{ span: 18 }} 
				layout="horizontal">
					{dom}
				</Form>
			)}
			>				
				<Form.Item<Subscription> label={t('app.fields.state')} name="state"  rules={[{ required: true }]}>
					<Select showSearch options={fileOptions}>
					</Select>
				</Form.Item>

				<Form.Item<Subscription> label={t("app.fields.note")} name="notes" required  rules={[{ required: true }]}>
					<Input.TextArea />
				</Form.Item>
		</Modal>
	);
}
 