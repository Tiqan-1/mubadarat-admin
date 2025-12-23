import levelsApi from "@/app/api/services/levels";
import tasksApi, { type Task } from "@/app/api/services/tasks";
import { Iconify } from "@/app/ui/components/icon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Collapse, List, Space, Tag, Typography, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TaskModal from "../../../tasks/task-form-modal";

interface Props {
	programId?: string;
	onPrev: () => void;
	onFinish: () => void;
}

export default function TasksStep({ programId, onPrev, onFinish }: Props) {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
	const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

	const { data: levels } = useQuery({
		queryKey: ["levels", { programId }],
		queryFn: () => levelsApi.get({ programId }),
		enabled: !!programId,
	});

	const handleAddTask = (levelId: string) => {
		setSelectedLevelId(levelId);
		setEditingTask({ levelId, programId });
		setIsModalOpen(true);
	};

	const handleEditTask = (task: Task) => {
		setSelectedLevelId(task.levelId);
		setEditingTask(task);
		setIsModalOpen(true);
	};

	const onTaskSaved = () => {
		setIsModalOpen(false);
		// The individual LevelTasksList will refetch via Query Client if we use the same key
	};

	return (
		<div className="space-y-4">
			<Typography.Title level={4}>{t("app.programs.builder.steps.curriculum")}</Typography.Title>

			<Collapse defaultActiveKey={levels?.items[0]?.id}>
				{levels?.items.map((level) => (
					<Collapse.Panel
						header={level.name}
						key={level.id}
						extra={
							<Button
								size="small"
								type="dashed"
								onClick={(e) => {
									e.stopPropagation();
									handleAddTask(level.id);
								}}
								icon={<Iconify icon="gridicons:add-outline" />}
							>
								{t("app.programs.builder.addTask")}
							</Button>
						}
					>
						<LevelTasksList levelId={level.id} onEditTask={handleEditTask} />
					</Collapse.Panel>
				))}
			</Collapse>

			<div className="flex justify-between pt-4">
				<Button onClick={onPrev}>{t("app.programs.builder.previous")}</Button>
				<Button type="primary" onClick={onFinish}>
					{t("app.programs.builder.finish")}
				</Button>
			</div>

			{isModalOpen && (
				<TaskModalWrapper
					isModalOpen={isModalOpen}
					editingTask={editingTask}
					selectedLevelId={selectedLevelId}
					programId={programId}
					onCancel={() => setIsModalOpen(false)}
					onSuccess={onTaskSaved}
				/>
			)}
		</div>
	);
}

function LevelTasksList({ levelId, onEditTask }: { levelId: string; onEditTask: (task: Task) => void }) {
	const { t } = useTranslation();
	const {
		data: tasks,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ["tasks", { levelId }],
		queryFn: () => tasksApi.get({ levelId }),
		enabled: !!levelId,
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => tasksApi.destroy(id),
		onSuccess: () => {
			message.success(t("common.success"));
			refetch();
		},
	});

	return (
		<List
			loading={isLoading}
			dataSource={tasks?.items || []}
			renderItem={(task) => (
				<List.Item
					actions={[
						<Button
							key="edit"
							type="text"
							icon={<Iconify icon="solar:pen-bold-duotone" />}
							onClick={() => onEditTask(task)}
						/>,
						<Button
							key="delete"
							type="text"
							danger
							icon={<Iconify icon="mingcute:delete-2-fill" />}
							onClick={() => deleteMutation.mutate(task.id)}
						/>,
					]}
				>
					<List.Item.Meta
						title={
							<Space>
								<Tag color={task.assignment ? "blue" : "green"}>
									{t(task.assignment ? "app.tasks.types.assignment" : "app.tasks.types.lesson")}
								</Tag>
								{task.date}
							</Space>
						}
						description={task.note}
					/>
				</List.Item>
			)}
			locale={{ emptyText: t("app.programs.builder.noTasks") }}
		/>
	);
}

function TaskModalWrapper({
	isModalOpen,
	editingTask,
	selectedLevelId,
	programId,
	onCancel,
	onSuccess,
}: {
	isModalOpen: boolean;
	editingTask: any;
	selectedLevelId: any;
	programId: any;
	onCancel: () => void;
	onSuccess: () => void;
}) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const saveMutation = useMutation({
		mutationFn: (payload: { id?: string; data: any }) => {
			if (payload.id) {
				return tasksApi.update(payload.id, payload.data);
			}
			return tasksApi.create({ ...payload.data, programId, levelId: selectedLevelId });
		},
		onSuccess: () => {
			message.success(t("common.success"));
			queryClient.invalidateQueries({ queryKey: ["tasks", { levelId: selectedLevelId }] });
			onSuccess();
		},
	});

	return (
		<TaskModal
			title={editingTask?.id ? t("common.edit") : t("common.create")}
			show={isModalOpen}
			formValue={editingTask || {}}
			okDisabled={saveMutation.isPending}
			onOk={(id: string | undefined, formData: any) => saveMutation.mutate({ id, data: formData })}
			onCancel={onCancel}
		/>
	);
}
