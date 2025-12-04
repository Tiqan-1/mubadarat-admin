import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";


import { AssignmentType, AssignmentState, type CreateRequest, type Assignment } from "@/app/api/services/assignments";
import { type JSX, useEffect, useState } from "react";
import { t } from "i18next";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

import levelsApi from "@/app/api/services/levels";
import subjectsApi from "@/app/api/services/subjects";
import programsApi from "@/app/api/services/programs";

export type AssignmentModalProps = {
	initialValues: Partial<Assignment>;
	title: string;
	show: boolean;
	okDisabled: boolean;
	onOk: (id: any | undefined, formData: any) => void;
	onCancel: VoidFunction;
};

export default function AssignmentModal({ title, show, initialValues, okDisabled, onOk, onCancel }: AssignmentModalProps) {
	const [form] = Form.useForm();
	const [programId, setProgramId] = useState<string | undefined>(undefined);
	useEffect(() => { form.setFieldsValue({ ...initialValues }) }, [initialValues, form]);

	const programs = useQuery({ queryKey: ['programs'], queryFn: () => programsApi.get(), refetchOnWindowFocus: false });
	const levels = useQuery({ queryKey: ['levels', programId], enabled: !!programId, queryFn: () => levelsApi.get({ programId }), refetchOnWindowFocus: false });
	const subjects = useQuery({ queryKey: ['subjects'], queryFn: () => subjectsApi.get({}), refetchOnWindowFocus: false });

	const programsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = programs.data?.items.map(({ id, name }) => ({ value: id, label: (<span>{name}</span>) }))
	programsOptions?.unshift({ value: '', label: (<span>{''}</span>) })

	const levelsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = levels.data?.items.map(({ id, name }) => ({ value: id, label: (<span>{name}</span>) }))

	const subjectsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = subjects.data?.items.map(({ id, name }) => ({ value: id, label: (<span>{name}</span>) }))
	subjectsOptions?.unshift({ value: '', label: (<span>{''}</span>) })

	const typeOptions = [
		{ value: AssignmentType.exam, label: (<span>{t('app.assignments.types.exam')}</span>) },
		{ value: AssignmentType.homework, label: (<span>{t('app.assignments.types.homework')}</span>) },
	]
	const stateOptions = [
		{ value: AssignmentState.draft, label: (<span>{t('app.assignments.states.draft')}</span>) },
		{ value: AssignmentState.published, label: (<span>{t('app.assignments.states.published')}</span>) },
		{ value: AssignmentState.canceled, label: (<span>{t('app.assignments.states.canceled')}</span>) },
		{ value: AssignmentState.closed, label: (<span>{t('app.assignments.states.closed')}</span>) },
		{ value: AssignmentState.deleted, label: (<span>{t('app.assignments.states.deleted')}</span>) },
	]

	const handleChangeProgram = (value: any) => {
		setProgramId(value);
		form.setFieldsValue({ levelId: null })
	};


	const dateParser = {
		getValueProps: (value: any) => ({ value: value && dayjs(value) }),
		normalize: (value: any) => value && `${dayjs(value).toISOString()}`
	}

	return (
		<Modal
			forceRender={true}
			title={title}
			open={show}
			okButtonProps={{ autoFocus: true, htmlType: 'submit', disabled: okDisabled }}
			okText={initialValues.id === undefined ? t('common.create') : t('common.edit')}
			// onOk={onOk} 
			cancelText={t("common.cancel")}
			onCancel={onCancel}
			modalRender={(dom) => (
				<Form
					form={form}
					initialValues={initialValues}
					onFinish={(x)=>{ 
						// check if availableFrom is before availableUntil
						const availFrom = dayjs(x.availableFrom);
						const availEnd = dayjs(x.availableUntil);
						if(availFrom.isAfter(availEnd)){
							form.setFields([{
								name: 'availableFrom',
								errors: [t('app.assignments.errors.availableFromAfterAvailableUntil')]
							}])
							return;
						}
						onOk(initialValues.id, x);
					 }}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="horizontal">
					{dom}
				</Form>
			)}
		>
			<Form.Item<CreateRequest> label={t('app.fields.type')} name="type" rules={[{ required: true }]}>
				<Select showSearch options={typeOptions}>
				</Select>
			</Form.Item>

			<Form.Item<CreateRequest> label={t("app.fields.title")} name="title" rules={[{ required: true }]}>
				<Input />
			</Form.Item>

			<Form.Item<CreateRequest> label={t('app.fields.program')} name="programId" >
				<Select showSearch options={programsOptions} onChange={handleChangeProgram}>
				</Select>
			</Form.Item>

			<Form.Item<CreateRequest> label={t('app.fields.level')} name="levelId" rules={[{ required: true }]}>
				<Select showSearch options={levelsOptions}>
				</Select>
			</Form.Item>


			<Form.Item<CreateRequest> label={t('app.fields.subject')} name="subjectId">
				<Select showSearch options={subjectsOptions}>
				</Select>
			</Form.Item>




			{initialValues.id && <Form.Item<CreateRequest> label={t('app.fields.state')} name="state" rules={[{ required: true }]}>
				<Select showSearch options={stateOptions}>
				</Select>
			</Form.Item>}


			<Form.Item<CreateRequest> label={t("app.fields.durationInMinutes")} name="durationInMinutes" rules={[{ required: true }]}>
				<InputNumber min={1} style={{ width: "100%" }} />
			</Form.Item>
			<Form.Item<CreateRequest> label={t("app.fields.passingScore")} name="passingScore" rules={[{ required: true }]}>
				<InputNumber min={1} style={{ width: "100%" }} />
			</Form.Item>

			<Form.Item<CreateRequest> label={t('app.fields.availableFrom')} name="availableFrom" {...dateParser} rules={[{ required: true }]}>
				<DatePicker />
			</Form.Item>
			<Form.Item<CreateRequest> label={t('app.fields.availableUntil')} name="availableUntil" {...dateParser} rules={[{ required: true }]}>
				<DatePicker />
			</Form.Item>

		</Modal>
	);
}
