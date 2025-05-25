import { Form, Input, Modal } from "antd"; 
 

import type { Subject } from "@/app/api/services/subjects";
import { useEffect } from "react";
import { t } from "i18next";
 

export type SubjectModalProps = {
	formValue: Partial<Subject>;
	title: string;
	show: boolean;
	okDisabled: boolean;
	onOk: (id:any|undefined,formData:any) => void;
	onCancel: VoidFunction;
};

export default function SubjectModal({ title, show, formValue, okDisabled, onOk, onCancel }: SubjectModalProps) {
	const [form] = Form.useForm(); 

	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);
  
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

				<Form.Item<Subject> label={t("app.fields.name")} name="name"  rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item<Subject> label={t("app.fields.description")} name="description" required  rules={[{ required: true }]}>
					<Input.TextArea />
				</Form.Item>
				
		</Modal>
	);
}
 