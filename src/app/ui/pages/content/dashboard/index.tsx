import { Iconify } from "@/app/ui/components/icon";
import { useQuery } from "@tanstack/react-query";
import { Badge, Calendar, Card, Col, Row, Skeleton, Space, Statistic, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import assignmentResponsesApi from "@/app/api/services/assignment-responses";
import programsApi from "@/app/api/services/programs";
import subscriptionsApi from "@/app/api/services/subscriptions";
import tasksApi from "@/app/api/services/tasks";
// import lessonsApi from "@/app/api/services/lessons";
// import levelsApi from "@/app/api/services/levels";
// import subjectsApi from "@/app/api/services/subjects";

const { Title } = Typography;

export default function DashboardPage() {
    const { t } = useTranslation();

    // Basic Counts for Cards
    const { data: programsData, isLoading: loadingPrograms } = useQuery({
        queryKey: ["programs", { pageSize: 100 }],
        queryFn: () => programsApi.get({ pageSize: 100 }),
    });

    // const { data: levelsData, isLoading: loadingLevels } = useQuery({
    //     queryKey: ["levels", { pageSize: 1 }],
    //     queryFn: () => levelsApi.get({ pageSize: 1 }),
    // });

    // const { data: subjectsData, isLoading: loadingSubjects } = useQuery({
    //     queryKey: ["subjects", { pageSize: 1 }],
    //     queryFn: () => subjectsApi.get({ pageSize: 1 }),
    // });

    // const { data: lessonsData, isLoading: loadingLessons } = useQuery({
    //     queryKey: ["lessons", { pageSize: 1 }],
    //     queryFn: () => lessonsApi.get({ pageSize: 1 }),
    // });

    const { data: tasksData, isLoading: loadingTasks } = useQuery({
        queryKey: ["tasks", { pageSize: 1000 }], // Fetch more for calendar
        queryFn: () => tasksApi.get({ pageSize: 1000 }),
    });

    const { data: subscriptionsData, isLoading: loadingSubscriptions } = useQuery({
        queryKey: ["subscriptions", { pageSize: 1000 }],
        queryFn: () => subscriptionsApi.get({ pageSize: 1000 }),
    });

    const { data: responsesData, isLoading: loadingResponses } = useQuery({
        queryKey: ["assignment-responses", { pageSize: 1000 }],
        queryFn: () => assignmentResponsesApi.get({ pageSize: 1000 }),
    });

    // Calculations
    const totalPrograms = programsData?.total ?? 0;
    const totalSubscriptions = subscriptionsData?.total ?? 0;
    const activeSubscriptions = subscriptionsData?.items?.filter((s) => s.state === "active").length ?? 0;

    const gradedResponses = responsesData?.items?.filter((r) => r.status === "graded" || r.status === "published") ?? [];
    const averageScore =
        gradedResponses.length > 0
            ? (gradedResponses.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedResponses.length).toFixed(1)
            : "0.0";

    const upcomingTasks = tasksData?.items?.filter((t) => dayjs(t.date).isAfter(dayjs())).length ?? 0;

    const stats = [
        {
            title: t("app.programs.title"),
            value: totalPrograms,
            loading: loadingPrograms,
            icon: "solar:backpack-broken",
            color: "#1890ff",
        },
        {
            title: t("app.activeSubscriptions"),
            value: activeSubscriptions + "/" + totalSubscriptions,
            loading: loadingSubscriptions,
            icon: "solar:users-group-rounded-broken",
            color: "#52c41a",
        },
        {
            title: t("app.averageScore"),
            value: averageScore,
            loading: loadingResponses,
            icon: "solar:chart-square-broken",
            color: "#faad14",
            suffix: "/ 100",
        },
        {
            title: t("app.upcomingTasks"),
            value: upcomingTasks,
            loading: loadingTasks,
            icon: "solar:calendar-minimalistic-broken",
            color: "#f5222d",
        },
    ];

    // Program Stats Table Data
    const programStats =
        programsData?.items?.map((p) => {
            const subsCount = subscriptionsData?.items?.filter((s) => s.program?.id === p.id).length ?? 0;
            return {
                ...p,
                subscribers: subsCount,
            };
        }) ?? [];

    const programColumns = [
        {
            title: t("app.programName"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("app.subscribers"),
            dataIndex: "subscribers",
            key: "subscribers",
            render: (val: number) => <Tag color="blue">{val}</Tag>,
            sorter: (a: any, b: any) => a.subscribers - b.subscribers,
        },
        {
            title: t("app.duration"),
            key: "duration",
            render: (_: any, record: any) => (
                <Typography.Text type="secondary">
                    {dayjs(record.start).format("YYYY-MM-DD")} - {dayjs(record.end).format("YYYY-MM-DD")}
                </Typography.Text>
            ),
        },
    ];

    // Calendar task rendering
    const dateCellRender = (value: dayjs.Dayjs) => {
        const listData = tasksData?.items?.filter((t) => dayjs(t.date).isSame(value, "day")) ?? [];
        return (
            <ul className="events m-0 p-0 list-none">
                {listData.map((item) => (
                    <li key={item.id}>
                        <Badge
                            status={item.assignment ? "error" : "processing"}
                            text={item.assignment ? t("app.tasks.types.assignment") : t("app.tasks.types.lesson")}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Space direction="vertical" size="large" className="w-full">
            <Title level={2}>{t("app.dashboard")}</Title>

            <Row gutter={[16, 16]}>
                {stats.map((item) => (
                    <Col xs={24} sm={12} lg={6} key={item.title}>
                        <Card bordered={false} className="h-full shadow-sm">
                            <Skeleton loading={item.loading} active>
                                <Statistic
                                    title={item.title}
                                    value={item.value}
                                    suffix={item.suffix}
                                    prefix={<Iconify icon={item.icon} size={32} style={{ color: item.color, marginRight: 12 }} />}
                                />
                            </Skeleton>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                    <Card title={t("app.programStats")} bordered={false} className="shadow-sm">
                        <Table
                            dataSource={programStats}
                            columns={programColumns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            loading={loadingPrograms || loadingSubscriptions}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card title={t("app.tasksCalendar")} bordered={false} className="shadow-sm">
                        <Calendar fullscreen={false} cellRender={dateCellRender} />
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}
