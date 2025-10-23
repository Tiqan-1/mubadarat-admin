import { Button, Card, Empty, Popconfirm, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table"; 
import { useTranslation } from "react-i18next";
 
import { IconButton, Iconify } from "@/app/ui/components/icon";
 

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/app/api/services/levels";
import type { Level } from "@/app/api/services/levels";
import { useLevelModal } from "./use-level-modal";
import LevelModal from "./level-form-modal";
import LevelFilter  from "./level-filter";
import { useEffect, useState } from "react"; 
import { useNavigate, useSearchParams } from "react-router";
import dayjs from "dayjs";
// import Paragraph from "antd/es/typography/Paragraph";
 
export default function LevelPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	// console.log('params', Object.fromEntries(searchParams.entries()))
	const { t } = useTranslation();
	const [filter, setFilter] = useState<any>(Object.fromEntries(searchParams.entries()));
    const {data, refetch, isLoading, isFetching} = useQuery({queryKey: ['levels', filter], queryFn: () => api.get(filter), refetchOnWindowFocus:false}); 
	const {modalProps, onCreate, onEdit} = useLevelModal(() => refetch()); 
	const mutationDelete = useMutation({
		mutationFn: (id:any) => {
			console.log('mutationDelete', id);
			return  api.destroy( id ) ;
		},
		onSuccess() {
			refetch();
		},
	})

	useEffect(()=>{
		setFilter(Object.fromEntries(searchParams.entries()))
	}, [searchParams])
	// useEffect(()=>{
	// 	console.log(`is loading: ${isLoading}`, `is fetching: ${isFetching}`, )
	// 	setFilterProps((prev) => ({ ...prev, okDisabled :(isLoading || isFetching) }));
	// }, [isLoading, isFetching])


  
	function onSearch (data: any)   {
		console.log('onSearch', data);
		setFilter(data);
	};
	function onClear  ()   {
		setFilter({});
	}

	const onDelete = (data: Level) => {
		console.log("delete ",data);
		mutationDelete.mutate(data.id) 
	};
	const columns: ColumnsType<Level> = [
		// {
		// 	title: t('app.fields.id'),
		// 	dataIndex: "id",
		// 	width: 100,
		// 	render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		// },
		{
			title: t('app.fields.name'),
			dataIndex: "name",
			render: (_, record) => <div>{record.name}</div>,
		},
		{
			title: t('app.fields.start'),
			dataIndex: "start",
			render: (_, record) => <div>{dayjs(record.start).format('YYYY-MM-DD')}</div>,
		}, 
		{
			title: t('app.fields.end'),
			dataIndex: "end",
			render: (_, record) => <div>{dayjs(record.end).format('YYYY-MM-DD')}</div>,
		}, 
		{
			title: t("common.action"),
			dataIndex: "operation",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{/* <IconButton onClick={() => onCreate(record)}>
						<Iconify icon="gridicons:add-outline" size={18} />
					</IconButton> */}
					<Button onClick={() => navigate(`/tasks?levelId=${record.id}`)} icon={<Iconify icon="solar:bill-list-broken" size={18} /> }>
						{t("app.tasks.title")}
					</Button>
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
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

			<LevelFilter formValue={filter} okDisabled={(isLoading || isFetching)} onClear={onClear} onSearch={onSearch} /> 

			<Card
				title={t("app.levels.grid-header")}
				extra={ <Button type="primary" onClick={() => onCreate()}> {t('common.create')} </Button> }
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
					locale={{ emptyText: <Empty description="No Data">Please select a program</Empty> }}
					dataSource={data?.items} 
					loading={(isLoading || isFetching)}
					pagination={{
					  pageSizeOptions:[10, 30, 50],
				      current: filter.page ?? 1,
					  showSizeChanger: true,
					  showQuickJumper: true,
					  total: data?.total, 
					  onChange: (page: number, _pageSize: number) => setFilter({...filter, page, pageSize:_pageSize})
					}}
				/>
	
	
				<LevelModal {...modalProps} />
			</Card>
		
		</Space>
	);
}
