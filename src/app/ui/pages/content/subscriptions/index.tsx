import {  Card, Divider, Popconfirm, Space, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table"; 
import { useTranslation } from "react-i18next";
 
import { IconButton, Iconify } from "@/app/ui/components/icon";
 

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/app/api/services/subscriptions";
import type { Subscription } from "@/app/api/services/subscriptions";
import { useSubscriptionModal } from "./use-subscription-modal";
import SubscriptionModal from "./subscription-form-modal";
import SubscriptionFilter  from "./subscription-filter";
import { useState } from "react"; 
import { useSearchParams } from "react-router";
import type { PresetStatusColorType } from "antd/es/_util/colors";
import Paragraph from "antd/es/typography/Paragraph";
 
 const TagTypes : {[k:string]: PresetStatusColorType} = {
	'active': "processing",
	'succeeded': "success",
	'failed': "default",
	'suspended': "warning",
	'deleted': "error",
 }
 // active, suspended, deleted, succeeded, failed

export default function SubscriptionPage() { 
	const [searchParams] = useSearchParams();
	// console.log('params', Object.fromEntries(searchParams.entries()))
	const { t } = useTranslation();
	const [filter, setFilter] = useState<any>(Object.fromEntries(searchParams.entries()));
    const {data, refetch, isLoading, isFetching} = useQuery({queryKey: ['subscriptions', filter], queryFn: () => api.get(filter), refetchOnWindowFocus:false}); 
	const {modalProps, onEdit} = useSubscriptionModal(() => refetch()); 
	const mutationDelete = useMutation({
		mutationFn: (id:any) => {
			// console.log('mutationDelete', id);
			return  api.destroy( id ) ;
		},
		onSuccess() {
			refetch();
		},
	}) 

  
	function onSearch (data: any)   { 
		setFilter(data);
	};
	function onClear  ()   {
		setFilter({});
	}

	const onDelete = (data: Subscription) => { 
		mutationDelete.mutate(data.id) 
	};
	const columns: ColumnsType<Subscription> = [
		// {
		// 	title: t('app.fields.id'),
		// 	dataIndex: "id",
		// 	width: 100,
		// 	render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		// },
		{
			title: t('app.fields.name'),
			dataIndex: "name",
			render: (_, record) => <div>{record.subscriber?.name}</div>,
		},
		{
			title: t('app.fields.program'),
			dataIndex: "description",
			render: (_, record) => <div>{record.program?.name}</div>,
		}, 
		{
			title: t('app.fields.level'),
			dataIndex: "description",
			render: (_, record) => <div>{record.level?.name}</div>,
		}, 
		{
			title: t('app.fields.state'),
			dataIndex: "type",
			render: (_, record) => <Tag color={TagTypes[record.state]}>{record.state}</Tag>,
		},
		{
			title: t('app.fields.note'),
			dataIndex: "description",
			render: (_, record) => <div>{record.notes}</div>,
		}, 
		{
			title: t("common.action"),
			dataIndex: "operation",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray"> 
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

			<SubscriptionFilter formValue={filter} okDisabled={(isLoading || isFetching)} onClear={onClear} onSearch={onSearch} /> 

    		<Divider>{t("app.subscriptions.grid-header")}</Divider>

			<Card
				title={t("app.subscriptions.grid-header")}
				// extra={ <Button type="primary" onClick={() => onCreate()}> {t('common.create')} </Button> }
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
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
	
	
				<SubscriptionModal {...modalProps} />
			</Card>
		
		</Space>
	);
}
