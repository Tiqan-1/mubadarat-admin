import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd"; 
 
import api from "@/app/api/services/programs";

import type { Level } from "@/app/api/services/levels";
import { type JSX, useEffect } from "react";
import { t } from "i18next";
import { useQuery } from "@tanstack/react-query";
 

type SearchFormFieldType = Pick<Level, "name" | "programId">;

export type LevelFilterProps = {
	formValue: Partial<Level>;
	okDisabled: boolean;
	onSearch: (formData:any) => void;
	onClear: VoidFunction;
};

export default function LevelFilter({ formValue, okDisabled, onSearch, onClear }: LevelFilterProps) {
	const [form] = Form.useForm(); 
	
    const {data} = useQuery({queryKey: ['programs'], queryFn: () => api.get(), refetchOnWindowFocus:false}); 

	const programsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = data?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))
	programsOptions?.unshift({value: '', label: (<span>{''}</span>)})

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
						<Form.Item<SearchFormFieldType> label={t('app.fields.program')} name="programId" className="!mb-0">
							<Select showSearch options={programsOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.name')} name="name" className="!mb-0">
							<Input />
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
 