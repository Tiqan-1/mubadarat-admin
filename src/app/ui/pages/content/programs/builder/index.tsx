import programsApi, { type Program } from "@/app/api/services/programs";
import { useQuery } from "@tanstack/react-query";
import { Card, Steps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import LevelsStep from "./steps/levels-step";
import ProgramDetailsStep from "./steps/program-details-step";
import PublishStep from "./steps/publish-step";
import TasksStep from "./steps/tasks-step";
import ThumbnailStep from "./steps/thumbnail-step";

export default function ProgramBuilder() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [current, setCurrent] = useState(0);
	const [program, setProgram] = useState<Partial<Program> | null>(null);

	const { data: existingPrograms } = useQuery({
		queryKey: ["programs", id],
		queryFn: () => programsApi.get({ id: id! }),
		enabled: !!id,
	});

	useEffect(() => {
		if (existingPrograms?.items) {
			const found = existingPrograms.items.find((p) => String(p.id) === String(id));
			if (found) {
				setProgram(found as any);
			}
		}
	}, [existingPrograms, id]);

	const next = () => {
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const steps = [
		{
			title: t("app.programs.builder.steps.details"),
			content: (
				<ProgramDetailsStep
					program={program}
					onSuccess={(updatedProgram) => {
						setProgram(updatedProgram);
						next();
					}}
				/>
			),
		},
		{
			title: t("app.programs.builder.steps.thumbnail"),
			content: (
				<ThumbnailStep
					programId={program?.id || id}
					program={program}
					onNext={(updatedProgram) => {
						setProgram(updatedProgram);
						next();
					}}
					onPrev={prev}
				/>
			),
		},
		{
			title: t("app.programs.builder.steps.levels"),
			content: <LevelsStep programId={program?.id || id} onNext={next} onPrev={prev} />,
		},
		{
			title: t("app.programs.builder.steps.curriculum"),
			content: <TasksStep programId={program?.id || id} onPrev={prev} onFinish={next} />,
		},
		{
			title: t("app.programs.builder.steps.publish"),
			content: <PublishStep programId={program?.id || id} onPrev={prev} onFinish={() => navigate("/programs")} />,
		},
	];

	const items = steps.map((item) => ({ key: item.title, title: item.title }));

	const contentStyle: React.CSSProperties = {
		marginTop: 16,
	};

	return (
		<Card title={t("app.programs.builder.title")}>
			<Steps current={current} items={items} />
			<div style={contentStyle}>{steps[current].content}</div>
		</Card>
	);
}
