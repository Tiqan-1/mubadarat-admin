import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd"; 
 
import api from "@/app/api/services/subjects";
import type { Lesson } from "@/app/api/services/lessons";

import { type JSX, useEffect } from "react";
import { t } from "i18next";
import { useQuery } from "@tanstack/react-query";

type SearchFormFieldType = Pick<Lesson, "title" | "subjectId" | "type">;

export type LessonFilterProps = {
	formValue: Partial<Lesson>;
	okDisabled: boolean;
	onSearch: (formData:any) => void;
	onClear: VoidFunction;
};

export default function LessonFilter({ formValue, okDisabled, onSearch, onClear }: LessonFilterProps) {
	const [form] = Form.useForm(); 
	
    const {data} = useQuery({queryKey: ['subjects'], queryFn: () => api.get({}), refetchOnWindowFocus:false}); 

	const subjectsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = data?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))
	subjectsOptions?.unshift({value: '', label: (<span>{''}</span>)})
	
	const fileOptions : {
		value: string;
		label: JSX.Element;
	}[] = [
		{value: '', label: (<span>{''}</span>)},
		{value: 'video', label: (<span>{t('app.lessons.types.video')}</span>)},
		{value: 'pdf', label: (<span>{t('app.lessons.types.pdf')}</span>)},
		{value: 'other', label: (<span>{t('app.lessons.types.other')}</span>)},
	]

	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);
  
	const onSearchFormReset = () => {
		form.resetFields();
		onClear();
	};

	return ( 
		<Card>
			<Form form={form} onFinish={onSearch} disabled={okDisabled} initialValues={{...formValue}}>
				<Row gutter={[16, 16]}>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.subject')} name="subjectId" className="!mb-0">
							<Select showSearch options={subjectsOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.title')} name="title" className="!mb-0">
							<Input />
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType>  label={t('app.fields.file type')} name="type">
							<Select showSearch options={fileOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<div className="flex justify-end">
							<Space>
								<Button onClick={onSearchFormReset}>{t("common.reset")}</Button>
									<Button type="primary" htmlType="submit" className="ml-4">
									{t("common.search")}
								</Button>
							</Space>
						</div>
					</Col>
				</Row>
			</Form>
		</Card>
	);
}
 