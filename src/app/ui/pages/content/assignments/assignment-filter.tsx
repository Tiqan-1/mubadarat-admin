import { Button, Card, Col, Form, Row, Select, Space } from "antd"; 
 
import levelsApi from "@/app/api/services/levels";
import subjectsApi from "@/app/api/services/subjects";
import type { Assignment } from "@/app/api/services/assignments";
import { type JSX, useEffect } from "react";
import { t } from "i18next";
import { useQuery } from "@tanstack/react-query";
import { useAssignmentFilterStore } from "./assignment-filter.store";
 

type SearchFormFieldType = Pick<Assignment, "title" | "levelId" | "subjectId" | "state" | "availableFrom" | "availableUntil">;

export type AssignmentFilterProps = {
	okDisabled: boolean;
};

export default function AssignmentFilter({ okDisabled }: AssignmentFilterProps) {
	const [form] = Form.useForm(); 
	
    const { filters, setFilters, clearFilters } = useAssignmentFilterStore();

    const {data:levelsData} = useQuery({queryKey: ['levels'], queryFn: () => levelsApi.get({}), refetchOnWindowFocus:false}); 
    const {data:subjectsData} = useQuery({queryKey: ['subjects'], queryFn: () => subjectsApi.get({}), refetchOnWindowFocus:false}); 

	const levelsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = levelsData?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))
	levelsOptions?.unshift({value: '', label: (<span>{''}</span>)})
	const subjectsOptions : {
		value: string;
		label: JSX.Element;
	}[]| undefined = subjectsData?.items.map(({id, name}) => ({value: id, label: (<span>{name}</span>)}))
	subjectsOptions?.unshift({value: '', label: (<span>{''}</span>)})

	useEffect(() =>{ form.setFieldsValue({...filters}) }, [filters, form]);
  
	
    const handleSearch = (formData: any) => {
        // Reset to page 1 for every new search
        setFilters({ ...formData, page: 1 });
    };

    const handleReset = () => {
        form.resetFields();
        clearFilters();
    };
	 

	return ( 
		<Card prefix="Search">
			<h3>{t("common.search")}</h3>
			<br />
			<Form form={form} onFinish={handleSearch} disabled={okDisabled} initialValues={filters}>
				<Row gutter={[16, 16]}>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.level')} name="levelId" className="!mb-0">
							<Select showSearch options={levelsOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={6}>
						<Form.Item<SearchFormFieldType> label={t('app.fields.subject')} name="subjectId" className="!mb-0">
							<Select showSearch options={subjectsOptions}>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} lg={12}>
						<div className="flex justify-end">
							<Space>
								<Button onClick={handleReset}>{t("common.reset")}</Button>
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
 