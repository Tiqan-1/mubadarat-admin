import { Button, Card, Divider, Empty, Popconfirm, Space } from "antd";
import Table, { type ColumnsType } from "antd/es/table"; 
import { useTranslation } from "react-i18next";
 
import { IconButton, Iconify } from "@/app/ui/components/icon";
 

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/app/api/services/tasks";
import type { Task } from "@/app/api/services/tasks";
import { useTaskModal } from "./use-task-modal";
import TaskModal from "./task-form-modal";
import TaskFilter  from "./task-filter";
import { useEffect, useState } from "react"; 
import { useSearchParams } from "react-router";
import dayjs from "dayjs";
import Paragraph from "antd/es/typography/Paragraph";
 
export default function TaskPage() {
	const [searchParams] = useSearchParams(); 
	const { t } = useTranslation();
	const [filter, setFilter] = useState<any>(Object.fromEntries(searchParams.entries()));
    const {data, refetch, isLoading, isFetching} = useQuery({queryKey: ['tasks', filter], queryFn: () => api.get(filter), refetchOnWindowFocus:false}); 
	const {modalProps, onCreate, onEdit} = useTaskModal(() => refetch()); 
	const mutationDelete = useMutation({
		mutationFn: (id:any) => {
			// console.log('mutationDelete', id);
			return  api.destroy( id ) ;
		},
		onSuccess() {
			refetch();
		},
	})

	useEffect(()=>{
		setFilter(Object.fromEntries(searchParams.entries()))
	}, [searchParams]) 


  
	function onSearch (data: any)   {
		// console.log('onSearch', data);
		setFilter(data);
	};
	function onClear  ()   {
		setFilter({});
	}

	const onDelete = (data: Task) => {
		// console.log("delete ",data);
		mutationDelete.mutate(data.id) 
	};
	const columns: ColumnsType<Task> = [
		{
			title: t('app.fields.id'),
			dataIndex: "id",
			width: 100,
			render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		},
		{
			title: t('app.fields.date'),
			dataIndex: "date",
			render: (_, record) => <div>{dayjs(record.date).format('YYYY-MM-DD')}</div>,
		},
		{
			title: t('app.fields.note'),
			dataIndex: "note",
			render: (_, record) => <div>{record.note}</div>,
		},
		{
			title: t('app.lessons.title'),
			dataIndex: "lessons",
			render: (_, record) => <div>{record.lessons?.map(e => e.title).join(', ') ?? '-'}</div>,
		},
		{
			title: t('app.fields.assignment'),
			dataIndex: "assignment",
			render: (_, record) => <div>{record.assignment?.title ?? '-'}</div>,
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
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Space  style={{width:10}} > </Space>
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

			<TaskFilter formValue={filter} okDisabled={(isLoading || isFetching)} onClear={onClear} onSearch={onSearch} /> 

    		<Divider>{t("app.tasks.grid-header")}</Divider>

			<Card
				// title={t("app.tasks.grid-header")}
				extra={ <Button type="primary" onClick={() => onCreate()}> {t('common.create')} </Button> }
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
					locale={{ emptyText: <Empty description="No Data">Please select a level</Empty> }}
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
	
	
				<TaskModal {...modalProps} />
			</Card>
		
		</Space>
	);
}
