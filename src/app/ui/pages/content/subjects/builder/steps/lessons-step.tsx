import lessonsApi, { type Lesson } from "@/app/api/services/lessons";
import { Iconify } from "@/app/ui/components/icon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, List, Popconfirm, Space, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import LessonModal from "../../../lessons/lesson-form-modal";
import { useLessonModal } from "../../../lessons/use-lesson-modal";

interface Props {
    subjectId?: string;
    onNext: () => void;
    onPrev: () => void;
}

export default function LessonsStep({ subjectId, onNext, onPrev }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: lessons, isLoading, refetch } = useQuery({
        queryKey: ["lessons", { subjectId }],
        queryFn: () => lessonsApi.get({ subjectId }),
        enabled: !!subjectId,
    });

    const { modalProps, onCreate, onEdit } = useLessonModal(() => {
        queryClient.invalidateQueries({ queryKey: ["lessons", { subjectId }] });
        refetch();
    });

    const mutationDelete = useMutation({
        mutationFn: (id: string) => lessonsApi.destroy(id),
        onSuccess: () => {
            toast.success(t("common.deleted-successfully"));
            refetch();
        },
    });

    const handleAddLesson = () => {
        onCreate({ subjectId } as any);
    };

    const getTagColor = (type: string) => {
        switch (type) {
            case "video": return "blue";
            case "pdf": return "orange";
            default: return "default";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Typography.Title level={4}>{t("app.subjects.builder.steps.lessons")}</Typography.Title>
                <Button type="primary" onClick={handleAddLesson} icon={<Iconify icon="solar:add-circle-broken" />}>
                    {t("common.create")}
                </Button>
            </div>

            <List
                loading={isLoading}
                dataSource={lessons?.items}
                renderItem={(lesson: Lesson) => (
                    <List.Item
                        actions={[
                            <IconButton key="edit" onClick={() => onEdit(lesson)}>
                                <Iconify icon="solar:pen-bold-duotone" size={18} />
                            </IconButton>,
                            <Popconfirm
                                key="delete"
                                title={t("common.confirm-deleting")}
                                onConfirm={() => mutationDelete.mutate(lesson.id)}
                            >
                                <button type="button">
                                    <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
                                </button>
                            </Popconfirm>,
                        ]}
                    >
                        <List.Item.Meta
                            title={lesson.title}
                            description={
                                <Space>
                                    <Tag color={getTagColor(lesson.type)}>{t(`app.lessons.types.${lesson.type}`)}</Tag>
                                    <Typography.Text type="secondary" className="text-xs">{lesson.url}</Typography.Text>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />

            <div className="flex justify-between pt-4 border-t">
                <Button onClick={onPrev}>{t("app.subjects.builder.previous")}</Button>
                <Button type="primary" onClick={onNext}>
                    {t("app.subjects.builder.next")}
                </Button>
            </div>

            <LessonModal {...modalProps} />
        </div>
    );
}

// Internal IconButton helper for consistent look
function IconButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
            {children}
        </button>
    );
}
