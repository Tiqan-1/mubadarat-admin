import levelsApi, { type Level } from "@/app/api/services/levels";
import { Iconify } from "@/app/ui/components/icon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, List, Typography, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LevelModal from "../../../levels/level-form-modal";

interface Props {
	programId?: string;
	onNext: () => void;
	onPrev: () => void;
}

export default function LevelsStep({ programId, onNext, onPrev }: Props) {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingLevel, setEditingLevel] = useState<Partial<Level> | null>(null);

	const { data, refetch, isLoading } = useQuery({
		queryKey: ["levels", { programId }],
		queryFn: () => levelsApi.get({ programId }),
		enabled: !!programId,
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => levelsApi.destroy(id),
		onSuccess: () => {
			message.success(t("common.success"));
			refetch();
		},
	});

	const saveMutation = useMutation({
		mutationFn: (payload: { id?: string; data: any }) => {
			if (payload.id) {
				return levelsApi.update(payload.id, payload.data);
			}
			return levelsApi.create({ ...payload.data, programId });
		},
		onSuccess: () => {
			message.success(t("common.success"));
			setIsModalOpen(false);
			refetch();
		},
	});

	const handleAdd = () => {
		setEditingLevel({ programId });
		setIsModalOpen(true);
	};

	const handleEdit = (level: Level) => {
		setEditingLevel(level);
		setIsModalOpen(true);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<Typography.Title level={4}>{t("app.programs.builder.steps.levels")}</Typography.Title>
				<Button type="dashed" onClick={handleAdd} icon={<Iconify icon="gridicons:add-outline" />}>
					{t("app.programs.builder.addLevel")}
				</Button>
			</div>

			<List
				loading={isLoading}
				dataSource={data?.items || []}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Button
								key="edit"
								type="text"
								icon={<Iconify icon="solar:pen-bold-duotone" />}
								onClick={() => handleEdit(item)}
							/>,
							<Button
								key="delete"
								type="text"
								danger
								icon={<Iconify icon="mingcute:delete-2-fill" />}
								onClick={() => deleteMutation.mutate(item.id)}
							/>,
						]}
					>
						<List.Item.Meta title={item.name} description={`${item.start} - ${item.end} `} />
					</List.Item>
				)}
				locale={{ emptyText: t("app.programs.builder.noLevels") }}
			/>

			<div className="flex justify-between pt-4">
				<Button onClick={onPrev}>{t("app.programs.builder.previous")}</Button>
				<Button type="primary" onClick={onNext} disabled={!data?.items?.length}>
					{t("app.programs.builder.next")}
				</Button>
			</div>

			{isModalOpen && (
				<LevelModal
					title={editingLevel?.id ? t("common.edit") : t("common.create")}
					show={isModalOpen}
					formValue={editingLevel || {}}
					okDisabled={saveMutation.isPending}
					onOk={(id: string | undefined, formData: any) => saveMutation.mutate({ id, data: formData })}
					onCancel={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
}
