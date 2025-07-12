import { Button, Card, Col, Form, Row, Select, Space } from "antd"; 
 
import api from "@/app/api/services/levels";

import type { Task } from "@/app/api/services/tasks";
import { type JSX, useEffect } from "react";
import { t } from "i18next";
import { useQuery } from "@tanstack/react-query";
 

type SearchFormFieldType = Pick<Task, "levelId">;

export type TaskFilterProps = {
	formValue: Partial<Task>;
	okDisabled: boolean;
	onSearch: (formData:any) => void;
	onClear: VoidFunction;
};

export default function TaskFilter({ formValue, okDisabled, onSearch, onClear }: TaskFilterProps) {
	const [form] = Form.useForm(); 
	
    const {data} = useQuery({queryKey: ['levels'], queryFn: () => api.get({}), refetchOnWindowFocus:false}); 

	const levelsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = data?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))
	levelsOptions?.unshift({value: '', label: (<span>{''}</span>)})

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
						<Form.Item<SearchFormFieldType> label={t('app.fields.level')} name="levelId" className="!mb-0">
							<Select showSearch options={levelsOptions}>
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
 