import programsApi from "@/app/api/services/programs";
import { Iconify } from "@/app/ui/components/icon";
import { useMutation } from "@tanstack/react-query";
import { Button, Popconfirm, Result } from "antd";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Props {
	programId?: string;
	onPrev: () => void;
	onFinish: () => void;
}

export default function PublishStep({ programId, onPrev, onFinish }: Props) {
	const { t } = useTranslation();

	const publishMutation = useMutation({
		mutationFn: () => programsApi.update(programId!, { state: "published" } as any),
		onSuccess: () => {
			toast.success(t("app.programs.builder.publishSuccess"));
			onFinish();
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});

	return (
		<div className="space-y-6">
			<Result
				icon={<Iconify icon="solar:rocket-2-bold-duotone" size={72} className="text-primary" />}
				title={t("app.programs.builder.steps.publish")}
				subTitle={t("app.programs.builder.publishConfirm")}
				extra={[
					<Button key="prev" onClick={onPrev}>
						{t("app.programs.builder.previous")}
					</Button>,
					<Popconfirm
						key="publish"
						title={t("app.programs.builder.publishConfirm")}
						onConfirm={() => publishMutation.mutate()}
						okText={t("common.ok")}
						cancelText={t("common.cancel")}
					>
						<Button type="primary" size="large" loading={publishMutation.isPending}>
							{t("app.programs.builder.publishNow")}
						</Button>
					</Popconfirm>,
				]}
			/>
		</div>
	);
}
