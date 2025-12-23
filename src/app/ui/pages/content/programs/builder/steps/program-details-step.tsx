import type { Program } from "@/app/api/services/programs";
import programsApi from "@/app/api/services/programs";
import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Select, Space, message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
	program: Partial<Program> | null;
	onSuccess: (program: Program) => void;
}

export default function ProgramDetailsStep({ program, onSuccess }: Props) {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	useEffect(() => {
		if (program) {
			form.setFieldsValue({
				...program,
				start: program.start ? dayjs(program.start) : undefined,
				end: program.end ? dayjs(program.end) : undefined,
				registrationStart: program.registrationStart ? dayjs(program.registrationStart) : undefined,
				registrationEnd: program.registrationEnd ? dayjs(program.registrationEnd) : undefined,
			});
		}
	}, [program, form]);

	const mutation = useMutation({
		mutationFn: (values: any) => {
			if (program?.id) {
				return programsApi.update(program.id, values);
			}
			return programsApi.create(values);
		},
		onSuccess: (data: any) => {
			message.success(t("common.success"));
			onSuccess(data);
		},
	});

	const onFinish = (values: any) => {
		// Validation logic from ProgramModal
		const regStart = dayjs(values.registrationStart);
		const regEnd = dayjs(values.registrationEnd);
		const progStart = dayjs(values.start);
		const progEnd = dayjs(values.end);

		if (regStart.isAfter(progStart) || regStart.isSame(progStart)) {
			form.setFields([
				{ name: "registrationStart", errors: [t("app.programs.errors.registrationStartBeforeProgramStart")] },
			]);
			return;
		}
		if (regStart.isAfter(regEnd) || regStart.isSame(regEnd)) {
			form.setFields([
				{ name: "registrationStart", errors: [t("app.programs.errors.registrationStartBeforeregistrationEnd")] },
			]);
			return;
		}
		if (regEnd.isAfter(progEnd) || regEnd.isSame(progEnd)) {
			form.setFields([{ name: "registrationEnd", errors: [t("app.programs.errors.registrationEndBeforeProgramEnd")] }]);
			return;
		}
		if (progStart.isAfter(progEnd) || progStart.isSame(progEnd)) {
			form.setFields([{ name: "start", errors: [t("app.programs.errors.programStartBeforeProgramEnd")] }]);
			return;
		}

		mutation.mutate(values);
	};

	const subscriptionTypes = [
		{ value: "public", label: t("app.programs.types.public") },
		{ value: "approval", label: t("app.programs.types.approval") },
	];

	return (
		<Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ programSubscriptionType: "public" }}>
			<Form.Item name="name" label={t("app.fields.name")} rules={[{ required: true }]}>
				<Input />
			</Form.Item>

			<Form.Item name="description" label={t("app.fields.description")} rules={[{ required: true }]}>
				<Input.TextArea rows={4} />
			</Form.Item>

			<div className="grid grid-cols-2 gap-4">
				<Form.Item
					name="programSubscriptionType"
					label={t("app.fields.programSubscriptionType")}
					rules={[{ required: true }]}
				>
					<Select options={subscriptionTypes} />
				</Form.Item>
				<Form.Item name="subscriptionFormUrl" label={t("app.fields.subscriptionFormUrl")}>
					<Input />
				</Form.Item>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Form.Item name="start" label={t("app.fields.start")} rules={[{ required: true }]}>
					<DatePicker className="w-full" />
				</Form.Item>
				<Form.Item name="end" label={t("app.fields.end")} rules={[{ required: true }]}>
					<DatePicker className="w-full" />
				</Form.Item>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Form.Item name="registrationStart" label={t("app.fields.registration start")} rules={[{ required: true }]}>
					<DatePicker className="w-full" />
				</Form.Item>
				<Form.Item name="registrationEnd" label={t("app.fields.registration end")} rules={[{ required: true }]}>
					<DatePicker className="w-full" />
				</Form.Item>
			</div>

			<Form.Item>
				<Space className="w-full justify-end">
					<Button type="primary" htmlType="submit" loading={mutation.isPending}>
						{t("app.programs.builder.next")}
					</Button>
				</Space>
			</Form.Item>
		</Form>
	);
}
