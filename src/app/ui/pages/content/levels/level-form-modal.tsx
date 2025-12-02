import { DatePicker, Form, Input, Modal, Select } from "antd"; 
 

import type { Level } from "@/app/api/services/levels";
import { type JSX, useEffect } from "react";
import { t } from "i18next";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
 
import api from "@/app/api/services/programs";

export type LevelModalProps = {
	formValue: Partial<Level>;
	title: string;
	show: boolean;
	okDisabled: boolean;
	onOk: (id:any|undefined,formData:any) => void;
	onCancel: VoidFunction;
};

export default function LevelModal({ title, show, formValue, okDisabled, onOk, onCancel }: LevelModalProps) {
	const [form] = Form.useForm(); 
	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);
	
    const {data} = useQuery({queryKey: ['programs'], queryFn: () => api.get(), refetchOnWindowFocus:false}); 

	const programsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = data?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))

	
	const dateParser = {
		getValueProps: (value:any) => ({ value: value && dayjs(value) }),
		normalize: (value:any) => value && `${dayjs(value).toISOString()}`
	}
  
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
				onFinish={(x)=> {
					// check if start is before end
					const start = dayjs(x.start);
					const end = dayjs(x.end);
					if(start.isAfter(end) || start.isSame(end)){
						form.setFields([{
							name: 'start',
							errors: [t('app.levels.errors.startBeforeEnd')],
						}]);
						return;
					}

					onOk(formValue.id, x)
				}}
				labelCol={{ span: 6 }} 
				wrapperCol={{ span: 18 }} 
				layout="horizontal">
					{dom}
				</Form>
			)}
			>

				{
					!formValue.id &&
					<Form.Item<Level> label={t('app.fields.program')} name="programId"  rules={[{ required: true }]}>
						<Select showSearch options={programsOptions}>
						</Select>
					</Form.Item>
				}

				<Form.Item<Level> label={t("app.fields.name")} name="name"  rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item<Level> label={t('app.fields.start')} name="start" {...dateParser} rules={[{ required: true }]}>
					<DatePicker style={{ width: '100%' }}/>
				</Form.Item>
				<Form.Item<Level> label={t('app.fields.end')} name="end" {...dateParser} rules={[{ required: true }]}>
					<DatePicker style={{ width: '100%' }}/>
				</Form.Item>

				
		</Modal>
	);
}
 