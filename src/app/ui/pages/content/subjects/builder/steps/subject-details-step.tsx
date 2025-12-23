import programsApi from "@/app/api/services/programs";
import subjectsApi, { type Subject } from "@/app/api/services/subjects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Props {
    subject: Partial<Subject> | null;
    onSuccess: (updatedSubject: Subject) => void;
}

export default function SubjectDetailsStep({ subject, onSuccess }: Props) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { data: programs } = useQuery({
        queryKey: ["programs"],
        queryFn: () => programsApi.get(),
    });

    const programOptions = programs?.items.map((p) => ({ value: p.id, label: p.name })) || [];

    useEffect(() => {
        if (subject) {
            form.setFieldsValue(subject);
        }
    }, [subject, form]);

    const mutation = useMutation({
        mutationFn: (values: any) => {
            if (subject?.id) {
                return subjectsApi.update(subject.id, values);
            }
            return subjectsApi.create(values);
        },
        onSuccess: (response: any) => {
            toast.success(t("common.success"));
            onSuccess(response.data || response); // Handle both wrapped and unwrapped response
        },
        onError: () => {
            toast.error(t("common.error"));
        },
    });

    const onFinish = (values: any) => {
        mutation.mutate(values);
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} className="max-w-2xl mx-auto">
            <Form.Item label={t("app.fields.program")} name="programId" rules={[{ required: true }]}>
                <Select options={programOptions} showSearch optionFilterProp="label" />
            </Form.Item>

            <Form.Item label={t("app.fields.name")} name="name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label={t("app.fields.description")} name="description" rules={[{ required: true }]}>
                <Input.TextArea rows={4} />
            </Form.Item>

            <div className="flex justify-end pt-4">
                <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                    {t("app.subjects.builder.steps.lessons")}
                </Button>
            </div>
        </Form>
    );
}
