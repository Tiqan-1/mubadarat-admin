import { Form, Input, Modal, Select } from "antd"; 
 

import type { Lesson } from "@/app/api/services/lessons";
import { type JSX, useEffect } from "react";
import { t } from "i18next"; 
import { useQuery } from "@tanstack/react-query";
 
import api from "@/app/api/services/subjects";

export type LessonModalProps = {
	formValue: Partial<Lesson>;
	title: string;
	show: boolean;
	okDisabled: boolean;
	onOk: (id:any|undefined,formData:any) => void;
	onCancel: VoidFunction;
};

export default function LessonModal({ title, show, formValue, okDisabled, onOk, onCancel }: LessonModalProps) {
	const [form] = Form.useForm(); 
	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);

    const {data} = useQuery({queryKey: ['subjects'], queryFn: () => api.get({}), refetchOnWindowFocus:false}); 

	const subjectsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = data?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))

	const fileOptions : {
		value: string;
		label: JSX.Element;
	}[] = [
		{value: 'video', label: (<span>{t('app.lessons.types.video')}</span>)},
		{value: 'pdf', label: (<span>{t('app.lessons.types.pdf')}</span>)},
		{value: 'other', label: (<span>{t('app.lessons.types.other')}</span>)},
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

				{
					!formValue.id &&
					<Form.Item<Lesson> label={t('app.fields.subject')} name="subjectId"  rules={[{ required: true }]}>
						<Select showSearch options={subjectsOptions}>
						</Select>
					</Form.Item>
				}

				<Form.Item<Lesson> label={t("app.fields.title")} name="title"  rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				
				<Form.Item<Lesson> label={t('app.fields.file type')} name="type"  rules={[{ required: true }]}>
					<Select showSearch options={fileOptions}>
					</Select>
				</Form.Item>
 
				<Form.Item<Lesson> label={t("app.fields.url")} name="url"  rules={[{ required: true }, { type: "url" }]}>
					<Input />
				</Form.Item>

				
		</Modal>
	);
}
 