import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space } from "antd"; 
 

import type { Program } from "@/app/api/services/programs";
import { type JSX, useEffect } from "react";
import { t } from "i18next";
 

type SearchFormFieldType = Pick<Program, "name" | "start" | "end" | "programSubscriptionType">;

export type ProgramFilterProps = {
	formValue: Partial<Program>;
	okDisabled: boolean;
	onSearch: (formData:any) => void;
	onClear: VoidFunction;
};

export default function ProgramFilter({ formValue, okDisabled, onSearch, onClear }: ProgramFilterProps) {
	const [form] = Form.useForm(); 

	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);
  
	const onSearchFormReset = () => {
		form.resetFields();
		onClear();
	};

	const subscriptionTypes : {
		value: string;
		label: JSX.Element;
	}[] = [
		{value: '', label: (<span>{''}</span>)},
		{value: 'public', label: (<span>{t('app.programs.types.public')}</span>)},
		{value: 'approval', label: (<span>{t('app.programs.types.approval')}</span>)},
	] 
	return ( 
		<Card>
			<Form form={form} onFinish={onSearch} disabled={okDisabled}>
				<Row gutter={[16, 16]}>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.name')} name="name" className="!mb-0">
							<Input />
						</Form.Item>
					</Col>
					<Col span={6} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.programSubscriptionType')} name="programSubscriptionType" className="!mb-0">
							<Select showSearch options={subscriptionTypes}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.start')} name="start" className="!mb-0">
							<DatePicker/>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.end')} name="end" className="!mb-0">
							<DatePicker/>
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
 