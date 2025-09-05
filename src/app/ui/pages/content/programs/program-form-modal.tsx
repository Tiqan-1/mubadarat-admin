import { DatePicker, Form, Input, Modal, Select } from "antd"; 
 

import type { Program } from "@/app/api/services/programs";
import { type JSX, useEffect, useRef } from "react";
import { t } from "i18next";
import dayjs from "dayjs";
 

export type ProgramModalProps = {
	formValue: Partial<Program>;
	title: string;
	show: boolean;
	forUpload: boolean;
	okDisabled: boolean;
	onOk: (id:any|undefined,formData:any) => void;
	onCancel: VoidFunction;
}; 

export default function ProgramModal({ title, show, forUpload, formValue, okDisabled, onOk, onCancel }: ProgramModalProps) {
	const [form] = Form.useForm(); 
	const uploadRef = useRef<HTMLInputElement>(null);

	useEffect(() =>{ 
		if(!forUpload){
			form.setFieldsValue({...formValue})
		}
	 }, [forUpload, formValue, form]);

	const dateParser = {
		getValueProps: (value:any) => ({ value: value && dayjs(value) }),
		normalize: (value:any) => value && `${dayjs(value).toISOString()}`
	}
 
	const statusOptions : {
		value: string;
		label: JSX.Element;
	}[] = [
		{value: 'created', label: (<span>{t('app.programs.statuses.created')}</span>)},
		{value: 'published', label: (<span>{t('app.programs.statuses.published')}</span>)},
		{value: 'suspended', label: (<span>{t('app.programs.statuses.suspended')}</span>)},
		{value: 'cancelled', label: (<span>{t('app.programs.statuses.cancelled')}</span>)},
		{value: 'deleted', label: (<span>{t('app.programs.statuses.deleted')}</span>)},
	]

	const subscriptionTypes : {
		value: string;
		label: JSX.Element;
	}[] = [
		{value: 'public', label: (<span>{t('app.programs.types.public')}</span>)},
		{value: 'approval', label: (<span>{t('app.programs.types.approval')}</span>)},
	]
	
	return (
		<Modal 
			forceRender={true} 
			title={title} 
			open={show} 
			okButtonProps={{ autoFocus: true, htmlType: 'submit', disabled:okDisabled }}
			okText={formValue.id === undefined ? t('common.create') : t('common.edit') }
			// onOk={onOk} 
			onOk={
				!forUpload ? undefined : (()=> {
				if(uploadRef.current?.files !== null){
					const x = {"thumbnail": uploadRef.current?.files[0] ?? undefined }
					// console.log("onModalOK !", x)
					onOk(formValue.id, x)
				}
			})}
			cancelText={t("common.cancel")}
			onCancel={onCancel}
			modalRender={(dom)=> (
				<Form 
				form={form}
				encType={forUpload ? "multipart/form-data" : undefined}
				initialValues={formValue}
				onFinish={forUpload ? undefined : (x)=> {
						// console.log("onFormFinish !", x)
						onOk(formValue.id, x)
					}
				}
				labelCol={{ span: 6 }} 
				wrapperCol={{ span: 18 }} 
				layout="horizontal">
					{dom}
				</Form>
			)}
			>

			{ 
				forUpload ? (
					// <Form.Item<Program> label={t("app.fields.thumbnail")} name="thumbnail" rules={[{ required: true }]}>
					// 	<Input type="file"  />
					// </Form.Item>s
					<input type="file" name="thumbnail" ref={uploadRef}  />
				) : (<>
					<Form.Item<Program> label={t("app.fields.name")} name="name"  rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					
					{
						formValue.id && 
						<Form.Item<Program> label={t('app.fields.state')} name="state">
							<Select showSearch options={statusOptions}>
							</Select>
						</Form.Item>
					}

					<Form.Item<Program> label={t("app.fields.description")} name="description" required  rules={[{ required: true }]}>
						<Input.TextArea />
					</Form.Item>
					
					

					<Form.Item<Program> label={t('app.fields.programSubscriptionType')} name="programSubscriptionType">
						<Select showSearch options={subscriptionTypes}>
						</Select>
					</Form.Item>
					<Form.Item<Program> label={t("app.fields.subscriptionFormUrl")} name="subscriptionFormUrl">
						<Input />
					</Form.Item>
					
					<Form.Item<Program> label={t('app.fields.start')} name="start" {...dateParser}>
						<DatePicker style={{ width: '100%' }}/>
					</Form.Item>
					<Form.Item<Program> label={t('app.fields.end')} name="end" {...dateParser}>
						<DatePicker style={{ width: '100%' }}/>
					</Form.Item>

					<Form.Item<Program> label={t('app.fields.registration start')} name="registrationStart" {...dateParser}>
						<DatePicker style={{ width: '100%' }}/>
					</Form.Item>
					<Form.Item<Program> label={t('app.fields.registration end')} name="registrationEnd" {...dateParser}>
						<DatePicker style={{ width: '100%' }}/>
					</Form.Item> 
				</>)
				 
			}
				
		</Modal>
	);
}
 