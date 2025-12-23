import { Button, Card, Divider, Popconfirm, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

import { IconButton, Iconify } from "@/app/ui/components/icon";

import api from "@/app/api/services/programs";
import type { Program } from "@/app/api/services/programs";
import { useMutation, useQuery } from "@tanstack/react-query";
import Paragraph from "antd/es/typography/Paragraph";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router";
import ProgramFilter from "./program-filter";
import ProgramModal from "./program-form-modal";
import { useProgramModal } from "./use-program-modal";

export default function ProgramPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [filter, setFilter] = useState<any>({});
	const { data, refetch, isLoading, isFetching } = useQuery({
		queryKey: ["programs", filter],
		queryFn: () => api.get(filter),
		refetchOnWindowFocus: false,
	});
	const { modalProps, onCreate, onEdit } = useProgramModal(false, () => refetch());
	const { modalProps: modalUploadProps, onEdit: onUpload } = useProgramModal(true, () => refetch());
	const mutationDelete = useMutation({
		mutationFn: (id: any) => {
			return api.destroy(id);
		},
		onSuccess() {
			refetch();
		},
	});
	const mutationLaunch = useMutation({
		mutationFn: (id: any) => {
			return api.update(id, { state: "published" });
		},
		onSuccess() {
			refetch();
		},
	});

	function onSearch(data: any) {
		setFilter(data);
	}
	function onClear() {
		setFilter({});
	}

	const onDelete = (data: Program) => {
		mutationDelete.mutate(data.id);
	};
	const onLaunch = (data: Program) => {
		mutationLaunch.mutate(data.id);
	};
	const columns: ColumnsType<Program> = [
		// {
		// 	title: t('app.fields.id'),
		// 	dataIndex: "id",
		// 	width: 100,
		// 	render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		// },
		{
			title: t("app.fields.name"),
			dataIndex: "name",
			fixed: "left",
			render: (_, record) => <div>{record.name}</div>,
		},
		{
			title: t("app.fields.thumbnail"),
			dataIndex: "name",
			render: (_, record) =>
				record.thumbnail && (
					<img width={50} height={50} src={`data:image/png;base64,${record.thumbnail}`} alt="thumbnail" />
				),
		},
		{
			title: t("app.fields.state"),
			dataIndex: "state",
			render: (_, record) => <div>{t(`app.programs.statuses.${record.state}`)}</div>,
		},
		{
			title: t("app.fields.description"),
			dataIndex: "description",
			width: 300,
			render: (_, record) => (
				<Paragraph copyable ellipsis>
					{record.description}
				</Paragraph>
			),
		},
		{
			title: t("app.fields.start"),
			dataIndex: "start",
			render: (_, record) => <div>{dayjs(record.start).format("YYYY-MM-DD")}</div>,
		},
		{
			title: t("app.fields.end"),
			dataIndex: "end",
			render: (_, record) => <div>{dayjs(record.end).format("YYYY-MM-DD")}</div>,
		},
		{
			title: t("app.fields.registration start"),
			dataIndex: "registrationStart",
			render: (_, record) => <div>{dayjs(record.registrationStart).format("YYYY-MM-DD")}</div>,
		},
		{
			title: t("app.fields.registration end"),
			dataIndex: "registrationEnd",
			render: (_, record) => <div>{dayjs(record.registrationEnd).format("YYYY-MM-DD")}</div>,
		},
		{
			title: t("app.levels.title"),
			dataIndex: "registrationEnd",
			render: (_, record) => (
				<Button
					onClick={() => navigate(`/levels?programId=${record.id}`)}
					icon={<Iconify icon="solar:layers-minimalistic-broken" size={18} />}
				>
					{t("app.levels.title")}
				</Button>
			),
		},
		{
			title: t("common.action"),
			dataIndex: "operation",
			width: 100,
			fixed: "right",
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{/* <IconButton onClick={() => onCreate(record)}>
						<Iconify icon="gridicons:add-outline" size={18} />
					</IconButton> */}
					<Popconfirm
						title={t("common.confirm-launch")}
						okText={t("common.ok")}
						cancelText={t("common.cancel")}
						placement="left"
						onConfirm={() => onLaunch(record)}
					>
						<button type="button">
							<Iconify icon="solar:rocket-2-broken" size={24} className="text-success-light" />
						</button>
					</Popconfirm>
					<IconButton onClick={() => navigate(`/programs/builder/${record.id}`)}>
						<Iconify icon="solar:magic-stick-3-bold-duotone" size={18} />
					</IconButton>
					<IconButton onClick={() => onUpload(record, t("app.fields.thumbnail"))}>
						<Iconify icon="solar:camera-outline" size={18} />
					</IconButton>
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title={t("common.confirm-deleting")}
						okText={t("common.ok")}
						cancelText={t("common.cancel")}
						placement="left"
						onConfirm={() => onDelete(record)}
					>
						<button type="button">
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</button>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" className="w-full">
			<ProgramFilter formValue={filter} okDisabled={isLoading || isFetching} onClear={onClear} onSearch={onSearch} />

			<Divider>{t("app.programs.grid-header")}</Divider>

			<Card
				title={t("app.programs.grid-header")}
				extra={
					<Space>
						<Button
							type="default"
							onClick={() => navigate("/programs/builder")}
							icon={<Iconify icon="solar:magic-stick-3-bold-duotone" />}
						>
							{t("app.programs.builder.title")}
						</Button>
						<Button type="primary" onClick={() => onCreate()}>
							{t("common.create")}
						</Button>
					</Space>
				}
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
					dataSource={data?.items}
					loading={isLoading || isFetching}
					pagination={{
						pageSizeOptions: [10, 30, 50],
						current: filter.page ?? 1,
						showSizeChanger: true,
						showQuickJumper: true,
						total: data?.total,
						onChange: (page: number, _pageSize: number) => setFilter({ ...filter, page, pageSize: _pageSize }),
					}}
				/>

				<ProgramModal {...modalProps} />
				<ProgramModal {...modalUploadProps} />
			</Card>
		</Space>
	);
}
