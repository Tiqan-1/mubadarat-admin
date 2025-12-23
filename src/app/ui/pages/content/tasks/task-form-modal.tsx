import { DatePicker, Form, Input, Modal, Select, Checkbox } from "antd";


import type { CreateRequest, Task } from "@/app/api/services/tasks";
import { type JSX, useEffect, useState } from "react";
import { t } from "i18next";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";

import levelsApi from "@/app/api/services/levels";
import lessonsApi from "@/app/api/services/lessons";
import subjectsApi from "@/app/api/services/subjects";
import assignmentsApi from "@/app/api/services/assignments";
import programsApi from "@/app/api/services/programs";

export type TaskModalProps = {
	formValue: Partial<Task>;
	title: string;
	show: boolean;
	okDisabled: boolean;
	onOk: (id: any | undefined, formData: any) => void;
	onCancel: VoidFunction;
};

export default function TaskModal({ title, show, formValue, okDisabled, onOk, onCancel }: TaskModalProps) {
	const [form] = Form.useForm();
	const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
	const [programId, setProgramId] = useState<string | undefined>(undefined);
	useEffect(() => { form.setFieldsValue({ ...formValue }) }, [formValue, form]);

	const programs = useQuery({ queryKey: ['programs'], queryFn: () => programsApi.get(), refetchOnWindowFocus: false });
	const levels = useQuery({ queryKey: ['levels', programId], queryFn: () => levelsApi.get({ programId }), refetchOnWindowFocus: false });
	const subjects = useQuery({ queryKey: ['subjects'], queryFn: () => subjectsApi.get({}), refetchOnWindowFocus: false });
	const assignments = useQuery({ queryKey: ['assignments'], queryFn: () => assignmentsApi.get({}), refetchOnWindowFocus: false });
	const lessons = useQuery({ queryKey: ['lessons', subjectId], queryFn: () => lessonsApi.get({ subjectId }), refetchOnWindowFocus: false });

	const programsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = programs.data?.items.map(({ id, name }) => ({ value: id, label: (<span>{name}</span>) }))
	programsOptions?.unshift({ value: '', label: (<span>{''}</span>) })

	const levelsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = levels.data?.items.map(({ id, name }) => ({ value: id, label: (<span>{name}</span>) }))

	const assignmentsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = assignments.data?.items.map(({ id, title }) => ({ value: id, label: (<span>{title}</span>) }))
	const subjectsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = subjects.data?.items.map(({ id, name }) => ({ value: id, label: (<span>{name}</span>) }))
	subjectsOptions?.unshift({ value: '', label: (<span>{''}</span>) })
	const lessonsOptions: {
		value: string;
		label: JSX.Element;
	}[] | undefined = lessons.data?.items.map(({ id, title }) => ({ value: id, label: (<span>{title}</span>) }))


	const handleChangeSubject = (value: any) => {
		setSubjectId(value);
	};
	const handleChangeProgram = (value: any) => {
		setProgramId(value);
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
			okText={formValue.id === undefined ? t('common.create') : t('common.edit')}
			// onOk={onOk} 
			cancelText={t("common.cancel")}
			onCancel={onCancel}
			modalRender={(dom) => (
				<Form
					form={form}
					initialValues={formValue}
					onFinish={(x) => onOk(formValue.id, x)}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="horizontal">
					{dom}
				</Form>
			)}
		>

			{
				!formValue.id &&
				<Form.Item<CreateRequest> label={t('app.fields.program')} name="programId">
					<Select showSearch options={programsOptions} onChange={handleChangeProgram}>
					</Select>
				</Form.Item>
			}

			{
				!formValue.id &&
				<Form.Item<CreateRequest> label={t('app.fields.level')} name="levelId" rules={[{ required: true }]}>
					<Select showSearch options={levelsOptions}>
					</Select>
				</Form.Item>
			}


			<Form.Item<CreateRequest> label={t('app.fields.subject')} name="subjectId">
				<Select showSearch options={subjectsOptions} onChange={handleChangeSubject}>
				</Select>
			</Form.Item>

			<Form.Item<CreateRequest> label={t('app.lessons.title')} name="lessonIds">
				<Select
					mode="multiple"
					allowClear
					style={{ width: '100%' }}
					placeholder="Please select"
					defaultValue={formValue.lessons?.map((lesson) => lesson.id)}
					options={lessonsOptions}
				/>
			</Form.Item>

			<Form.Item<CreateRequest> label={t('app.fields.assignment')} name="assignmentId">
				<Select showSearch options={assignmentsOptions}>
				</Select>
			</Form.Item>


			<Form.Item<CreateRequest> label={t('app.fields.date')} name="date" {...dateParser} rules={[{ required: true }]}>
				<DatePicker style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item<CreateRequest> label={t('app.fields.note')} name="note" >
				<Input.TextArea />
			</Form.Item>

			<Form.Item<CreateRequest> label={null} name="hasChatRoom" valuePropName="checked" >
				<Checkbox>{t('app.fields.hasChatRoom')}</Checkbox>
			</Form.Item>

		</Modal>
	);
}
