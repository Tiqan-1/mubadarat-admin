import programsApi, { type Program } from "@/app/api/services/programs";
import { Iconify } from "@/app/ui/components/icon";
import { useMutation } from "@tanstack/react-query";
import { Button, Typography } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Props {
	programId?: string;
	program: Partial<Program> | null;
	onNext: (updatedProgram: Program) => void;
	onPrev: () => void;
}

export default function ThumbnailStep({ programId, program, onNext, onPrev }: Props) {
	const { t } = useTranslation();
	const uploadRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(program?.thumbnail);

	const uploadMutation = useMutation({
		mutationFn: (file: File) => programsApi.update(programId!, { thumbnail: file } as any),
		onSuccess: (updatedProgram: any) => {
			toast.success(t("common.success"));
			onNext(updatedProgram);
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleSave = () => {
		const file = uploadRef.current?.files?.[0];
		if (file) {
			uploadMutation.mutate(file);
		} else if (program?.thumbnail) {
			// If already has thumbnail and no new one selected, just go next
			onNext(program as Program);
		} else {
			// toast.warning(t("app.programs.errors.thumbnailRequired"));
			onNext(program as Program);
		}
	};

	const triggerUpload = () => {
		uploadRef.current?.click();
	};

	return (
		<div className="space-y-6 flex flex-col items-center w-full">
			<Typography.Title level={4}>{t("app.programs.builder.steps.thumbnail")}</Typography.Title>

			<div
				className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors group"
				onClick={triggerUpload}
			>
				{previewUrl ? (
					<img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
				) : (
					<div className="flex flex-col items-center text-gray-400 group-hover:text-primary">
						<Iconify icon="solar:camera-add-bold" size={48} />
						<span className="mt-2 text-sm font-medium">{t("app.programs.builder.uploadThumbnail")}</span>
					</div>
				)}

				{previewUrl && (
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
						<Iconify icon="solar:pen-new-square-broken" size={32} className="text-white" />
					</div>
				)}
			</div>

			<input type="file" ref={uploadRef} className="hidden" accept="image/*" onChange={handleFileChange} />

			<div className="flex justify-between w-full pt-4 max-w-md mx-auto">
				<Button onClick={onPrev}>{t("app.programs.builder.previous")}</Button>
				<Button type="primary" onClick={handleSave} loading={uploadMutation.isPending}>
					{t("app.programs.builder.next")}
				</Button>
			</div>
		</div>
	);
}
