import { Button, Card, Empty, Popconfirm, Space, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table"; 
import { useTranslation } from "react-i18next";
 
import { IconButton, Iconify } from "@/app/ui/components/icon";
 

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/app/api/services/lessons";
import type { Lesson } from "@/app/api/services/lessons";
import { useLessonModal } from "./use-lesson-modal";
import LessonModal from "./lesson-form-modal";
import LessonFilter  from "./lesson-filter";
import { useEffect, useState } from "react"; 
import { useSearchParams } from "react-router"; 
import type { PresetStatusColorType } from "antd/lib/_util/colors";
// import Paragraph from "antd/es/typography/Paragraph";

const TagTypes : {[k:string]: PresetStatusColorType} = {
	'video': "processing",
	'pdf': "warning",
	'other': "error",
}
 
export default function LessonPage() {
	const [searchParams] = useSearchParams(); 
	const { t } = useTranslation();
	const [filter, setFilter] = useState<any>(Object.fromEntries(searchParams.entries()));
    const {data, refetch, isLoading, isFetching} = useQuery({queryKey: ['lessons', filter], queryFn: () => api.get(filter), refetchOnWindowFocus:false}); 
	const {modalProps, onCreate, onEdit} = useLessonModal(() => refetch()); 
	const mutationDelete = useMutation({
		mutationFn: (id:any) => {
			console.log('mutationDelete', id);
			if(filter.subjectId)	
				return  api.destroy( filter.subjectId ,id ) ;
			alert('Unkown lesson parent(subjectId)')
			return Promise.resolve()
		},
		onSuccess() {
			refetch();
		},
	})

	useEffect(()=>{
		setFilter(Object.fromEntries(searchParams.entries()))
	}, [searchParams]) 
 
  
	function onSearch (data: any)   {
		console.log('onSearch', data);
		setFilter(data);
	};
	function onClear  ()   {
		setFilter({});
	}

	const onDelete = (data: Lesson) => {
		console.log("delete ",data);
		mutationDelete.mutate(data.id) 
	};
	const columns: ColumnsType<Lesson> = [
		// {
		// 	title: t('app.fields.id'),
		// 	dataIndex: "id",
		// 	width: 100,
		// 	render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		// },
		{
			title: t('app.fields.title'),
			dataIndex: "title",
			render: (_, record) => <div>{record.title}</div>,
		},
		{
			title: t('app.fields.file type'),
			dataIndex: "type",
			render: (_, record) => <Tag color={TagTypes[record.type]}>{record.type}</Tag>,
		},
		{
			title: t('app.fields.url'),
			dataIndex: "url",
			render: (_, record) => (
				<Button color="default" variant="link" target="_blank" href={record.url}>
				  {record.url}
				</Button>),
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

			<LessonFilter formValue={filter} okDisabled={(isLoading || isFetching)} onClear={onClear} onSearch={onSearch} /> 

			<Card
				title={t("app.lessons.grid-header")}
				extra={ <Button type="primary" onClick={() => onCreate()}> {t('common.create')} </Button> }
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
					locale={{ emptyText: <Empty description="No Data">Please select a subject</Empty> }}
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
	
	
				<LessonModal {...modalProps} />
			</Card>
		
		</Space>
	);
}
