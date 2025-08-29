import { Button, Card, Divider, Empty, Popconfirm, Space, Tag } from "antd";
import Table, { type ColumnsType } from "antd/es/table"; 
import { useTranslation } from "react-i18next";
 
import { IconButton, Iconify } from "@/app/ui/components/icon";
 

import { useMutation, useQuery } from "@tanstack/react-query";
import api, { AssignmentGradingState } from "@/app/api/services/assignments";
import type { Assignment } from "@/app/api/services/assignments";
import { useAssignmentModal } from "./use-assignment-modal";
import AssignmentModal from "./assignment-form-modal";
import AssignmentFilter  from "./assignment-filter";
import dayjs from "dayjs";
import Paragraph from "antd/es/typography/Paragraph";
import type { PresetStatusColorType } from "antd/es/_util/colors";
import { useAssignmentFilterStore } from "./assignment-filter.store";
import { useSyncFiltersWithUrl } from "./use-sync-filters-with-url";
import { toast } from "sonner";
import { Link } from "react-router";
// Tag colors for the main status
const TagTypes : {[k:string]: PresetStatusColorType} = {
	'draft': 'warning',
	'published': 'processing',
	'canceled': 'default',
	'closed': 'success',
	'deleted': 'error',
};

// --- Tag colors for the new grading status ---
const GradingTagTypes: {[k:string]: PresetStatusColorType} = {
    [AssignmentGradingState.PENDING]: 'warning',
    [AssignmentGradingState.PUBLISHED]: 'success',
};


export default function AssignmentPage() {
    useSyncFiltersWithUrl();
	const { t } = useTranslation();
	const {modalProps, onCreate, onEdit} = useAssignmentModal(() => refetch()); 
    const { filters, updateFilter } = useAssignmentFilterStore();
    const {data, refetch, isLoading, isFetching} = useQuery({queryKey: ['assignments', filters], queryFn: () => api.get(filters), refetchOnWindowFocus:false}); 
	const mutationDelete = useMutation({
		mutationFn: (id:any) => {
			return  api.destroy( id ) ;
		},
		onSuccess() {
            toast.success(t("common.deleted-successfully"));
			refetch();
		},
	})
	
    const mutationPublish = useMutation({
        mutationFn: (id: string) => api.publishGrades(id),
        onSuccess: () => {
            toast.success(t("app.assignments.grades-published-successfully"));
            refetch(); // Refetch the list to show the new status
        },
        onError: (_error: any) => {
            // error already displayed by http client
            // toast.error(error?.response?.data?.message || t("common.error-occurred"));
        }
    });


	const openBuilder = async (record: Assignment)  => window.open(`/#/builder?id=${record.id}`, '_blank', 'noreferrer')
   

	const onDelete = (data: Assignment) => {
		mutationDelete.mutate(data.id) 
	};
    const onPublish = (data: Assignment) => {
        mutationPublish.mutate(data.id);
    };


	const columns: ColumnsType<Assignment> = [
		{
			title: t('app.fields.id'),
			dataIndex: "id",
    		width: 120,
			render: (_, record) => <Paragraph copyable ellipsis>{record.id}</Paragraph>,
		},
		{
			title: t('app.fields.title'),
			dataIndex: "title",
			render: (title: string, record: Assignment) => (
				<Link to={`/assignments/${record.id}/responses`}>{title}</Link>
			),
		},
		{
			title: t('app.fields.type'),
			dataIndex: "type",
			render: (_, record) => <div>{t(`app.assignments.types.${record.type}`)}</div>,
		},
		{
			title: t('app.fields.state'),
			dataIndex: "state",
			render: (_, record) => <Tag color={TagTypes[record.state]}>{t(`app.assignments.states.${record.state}`)}</Tag>,
		},
        {
            title: t('app.fields.gradingStatus'),
            dataIndex: 'gradingState',
            render: (gradingState: AssignmentGradingState) => (
                <Tag color={GradingTagTypes[gradingState]}>
                    {t(`app.assignments.gradingStates.${gradingState}`)}
                </Tag>
            )
        },
		{
			title: t('app.fields.durationInMinutes'),
			dataIndex: "durationInMinutes",
		},
		{
			title: t('app.fields.passingScore'),
			dataIndex: "passingScore",
		},
		{
			title: t('app.fields.availableFrom'),
			dataIndex: "availableFrom",
			render: (_, record) => <div>{dayjs(record.availableFrom).format('YYYY-MM-DD')}</div>,
		},  
		{
			title: t('app.fields.availableUntil'),
			dataIndex: "availableUntil",
			render: (_, record) => <div>{dayjs(record.availableUntil).format('YYYY-MM-DD')}</div>,
		},
		{
			title: t("common.action"),
			dataIndex: "operation",
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray space-x-1">
					{/* <IconButton onClick={() => onCreate(record)}>
						<Iconify icon="gridicons:add-outline" size={18} />
					</IconButton> */}
					<Button onClick={()=>openBuilder(record)} icon={<Iconify icon="solar:bill-list-broken" size={18} /> }>
						{t("app.assignments.edit-assignment-form")}
					</Button>
					
                    { record.gradingState !== AssignmentGradingState.PUBLISHED 
					&& <Popconfirm 
                        title={t("app.assignments.confirm-publishing-grades")} 
                        okText={t("common.ok")} 
                        cancelText={t("common.cancel")} 
                        placement="left" 
                        onConfirm={() => onPublish(record)}
                    >
                        <Button>
                            <Iconify icon="solar:upload-bold-duotone" size={18} className='text-success'/>
							{t("app.assignments.publish-grades")}
                        </Button>
                    </Popconfirm>}
					
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

			<AssignmentFilter okDisabled={(isLoading || isFetching)} /> 

    		<Divider>{t("app.assignments.grid-header")}</Divider>

			<Card 
				extra={ <Button type="primary" onClick={() => onCreate()}> {t('common.create')} </Button> }
			>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					columns={columns}
					locale={{ emptyText: <Empty description="No Data">Please select a level</Empty> }}
					dataSource={data?.items} 
					loading={(isLoading || isFetching || mutationPublish.isPending)}
					pagination={{
					  pageSizeOptions:[10, 30, 50],
				      current: filters.page ?? 1,
					  showSizeChanger: true,
					  showQuickJumper: true,
					  total: data?.total, 
					  onChange: (page: number, _pageSize: number) => updateFilter({ page, pageSize:_pageSize })
					}}
				/>
	
	
				<AssignmentModal {...modalProps} />
			</Card>
		
		</Space>
	);
}
