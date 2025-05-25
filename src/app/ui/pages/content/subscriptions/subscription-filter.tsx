import { Button, Card, Col, Form,  Row, Select, Space } from "antd"; 
 
import api from "@/app/api/services/programs";

import type { Subscription, SubscriptionSearch } from "@/app/api/services/subscriptions";
import { type JSX, useEffect } from "react";
import { t } from "i18next";
import { useQuery } from "@tanstack/react-query";
 

type SearchFormFieldType = SubscriptionSearch //Pick<Subscription, "state" | "notes">;

export type SubscriptionFilterProps = {
	formValue: Partial<Subscription>;
	okDisabled: boolean;
	onSearch: (formData:any) => void;
	onClear: VoidFunction;
};

export default function SubscriptionFilter({ formValue, okDisabled, onSearch, onClear }: SubscriptionFilterProps) {
	const [form] = Form.useForm(); 
	
    const {data} = useQuery({queryKey: ['programs'], queryFn: () => api.get(), refetchOnWindowFocus:false}); 

	const programsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = data?.items?.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))
	programsOptions?.unshift({value: '', label: (<span>{''}</span>)})

	useEffect(() =>{ form.setFieldsValue({...formValue}) }, [formValue, form]);
  
	const onSearchFormReset = () => {
		form.resetFields();
		onClear();
	};

	const fileOptions : {
		value: string|undefined;
		label: JSX.Element;
	}[] = [
		{value: undefined, label: (<span> </span>)},
		{value: 'active', label: (<span>{t('app.subscriptions.statuses.active')}</span>)},
		{value: 'succeeded', label: (<span>{t('app.subscriptions.statuses.succeeded')}</span>)},
		{value: 'failed', label: (<span>{t('app.subscriptions.statuses.failed')}</span>)},
		{value: 'suspended', label: (<span>{t('app.subscriptions.statuses.suspended')}</span>)},
		{value: 'deleted', label: (<span>{t('app.subscriptions.statuses.deleted')}</span>)},
	]

	return ( 
		<Card>
			<Form form={form} onFinish={onSearch} disabled={okDisabled} initialValues={{...formValue}}>
				<Row gutter={[16, 16]}>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.program')} name="programId" className="!mb-0">
							<Select showSearch options={programsOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.state')} name="state"  rules={[{ required: true }]}>
							<Select showSearch options={fileOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={12}>
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
 