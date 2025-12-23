import { Button, Card, Divider, Popconfirm, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

import { IconButton, Iconify } from "@/app/ui/components/icon";


import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/app/api/services/subjects";
import type { Subject } from "@/app/api/services/subjects";
import { useSubjectModal } from "./use-subject-modal";
import SubjectModal from "./subject-form-modal";
import SubjectFilter from "./subject-filter";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Paragraph from "antd/es/typography/Paragraph";

export default function SubjectPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	// console.log('params', Object.fromEntries(searchParams.entries()))
	const { t } = useTranslation();
	const [filter, setFilter] = useState<any>(Object.fromEntries(searchParams.entries()));
	const { data, refetch, isLoading, isFetching } = useQuery({ queryKey: ['subjects', filter], queryFn: () => api.get(filter), refetchOnWindowFocus: false });
	const { modalProps, onCreate, onEdit } = useSubjectModal(() => refetch());
	const mutationDelete = useMutation({
		mutationFn: (id: any) => {
			// console.log('mutationDelete', id);
			return api.destroy(id);
		},
		onSuccess() {
			refetch();
		},
	})

	// useEffect(()=>{
	// 	console.log(`is loading: ${isLoading}`, `is fetching: ${isFetching}`, )
	// 	setFilterProps((prev) => ({ ...prev, okDisabled :(isLoading || isFetching) }));
	// }, [isLoading, isFetching])



	function onSearch(data: any) {
		// console.log('onSearch', data);
		setFilter(data);
	};
	function onClear() {
		setFilter({});
	}

	const onDelete = (data: Subject) => {
		// console.log("delete ",data);
		mutationDelete.mutate(data.id)
	};
	const columns: ColumnsType<Subject> = [
		// {
		// 	title: t('app.fields.id'),
		// 	dataIndex: "id",
		// 	width: 100,
		// 	render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		// },
		{
			title: t('app.fields.name'),
			dataIndex: "name",
			fixed: 'left',
			render: (_, record) => <div>{record.name}</div>,
		},
		{
			title: t('app.fields.description'),
			dataIndex: "description",
			// render: (_, record) => <div>{record.description}</div>,
			width: 400,
			render: (_, record) => <Paragraph copyable ellipsis>{record.description}</Paragraph>,
		},
		{
			title: t("common.action"),
			key: "operation",
			fixed: 'right',
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{/* <IconButton onClick={() => onCreate(record)}>
						<Iconify icon="gridicons:add-outline" size={18} />
					</IconButton> */}
					<IconButton onClick={() => navigate(`/subjects/builder/${record.id}`)}>
						<Iconify icon="solar:magic-stick-3-bold-duotone" size={18} />
					</IconButton>
					<Button onClick={() => navigate(`/lessons?subjectId=${record.id}`)} icon={<Iconify icon="solar:video-frame-play-horizontal-broken" size={18} />}>
						{t("app.lessons.title")}
					</Button>
					{/* <IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton> */}
					<Popconfirm title={t("common.confirm-deleting")} okText={t("common.ok")} cancelText={t("common.cancel")} placement="left" onConfirm={() => onDelete(record)}>
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

			<SubjectFilter formValue={filter} okDisabled={(isLoading || isFetching)} onClear={onClear} onSearch={onSearch} />

			<Divider>{t("app.subjects.grid-header")}</Divider>

			<Card
				// title={t("app.subjects.grid-header")}
				extra={
					<Space>
						<Button
							type="default"
							onClick={() => navigate("/subjects/builder")}
							icon={<Iconify icon="solar:magic-stick-3-bold-duotone" />}
						>
							{t("app.subjects.builder.title")}
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
					loading={(isLoading || isFetching)}
					pagination={{
						pageSizeOptions: [10, 30, 50],
						current: filter.page ?? 1,
						showSizeChanger: true,
						showQuickJumper: true,
						total: data?.total,
						onChange: (page: number, _pageSize: number) => setFilter({ ...filter, page, pageSize: _pageSize })
					}}
				/>


				<SubjectModal {...modalProps} />
			</Card>

		</Space>
	);
}
