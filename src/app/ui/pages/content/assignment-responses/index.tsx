import { Button, Card, Divider, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table"; 
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { PresetStatusColorType } from "antd/es/_util/colors";

import responsesApi, { type AssignmentResponse, AssignmentResponseStatus } from "@/app/api/services/assignment-responses";
// import { usePaginationStore } from "@/stores/pagination.store"; // A simple Zustand store for page state
import { Iconify } from "@/app/ui/components/icon";
import { Link, useParams } from "react-router";
import { useState } from "react";

// You can create a pagination store like the filter store to manage page/pageSize
// For simplicity, I'll use a local state here.

const StatusTagTypes: { [key in AssignmentResponseStatus]: PresetStatusColorType } = {
    [AssignmentResponseStatus.IN_PROGRESS]: 'default',
    [AssignmentResponseStatus.SUBMITTED]: 'processing',
    [AssignmentResponseStatus.GRADED]: 'warning',
    [AssignmentResponseStatus.PUBLISHED]: 'success',
};

export default function AssignmentResponsesPage() {
    const { t } = useTranslation();
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['assignment-responses', assignmentId, pagination],
        queryFn: () => responsesApi.get({ assignmentId: assignmentId!, ...pagination }),
        enabled: !!assignmentId, // Only run query if assignmentId is present
    });

    const columns: ColumnsType<AssignmentResponse> = [
        {
            title: t('app.fields.student'),
            dataIndex: ['student', 'name'], // Access nested property
        },
        {
            title: t('app.fields.status'),
            dataIndex: 'status',
            render: (status: AssignmentResponseStatus) => (
                <Tag color={StatusTagTypes[status]}>
                    {t(`app.assignmentResponses.statuses.${status}`)}
                </Tag>
            ),
        },
        {
            title: t('app.fields.score'),
            dataIndex: 'score',
            render: (score) => score ?? 'N/A', // Show N/A if score is null/undefined
        },
        {
            title: t('app.fields.submittedAt'),
            dataIndex: 'submittedAt',
            render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : 'In Progress',
        },
        {
            title: t("common.action"),
            key: 'operation',
            align: 'right',
            render: (_, record) => (
                <Space>
                    {/* This link will navigate to the individual grading page (Feature 3) */}
                    <Link to={`/responses/${record.id}`}>
                        <Button icon={<Iconify icon="solar:pen-bold-duotone" />} size="small">
                            {t('common.view-and-grade')}
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" className="w-full">
            {/* You can add a Card with the Assignment Title here by fetching it separately */}
            <Divider>{t("app.assignmentResponses.grid-header")}</Divider>

            <Card>
                <Table
                    rowKey="id"
                    size="small"
                    columns={columns}
                    dataSource={data?.items}
                    loading={isLoading || isFetching}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.pageSize,
                        total: data?.total,
                        onChange: (page, pageSize) => setPagination({ page, pageSize }),
                    }}
                />
            </Card>
        </Space>
    );
}