import subjectsApi, { type Subject } from "@/app/api/services/subjects";
import { useQuery } from "@tanstack/react-query";
import { Card, Steps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import LessonsStep from "./steps/lessons-step.tsx";
import PublishStep from "./steps/publish-step.tsx";
import SubjectDetailsStep from "./steps/subject-details-step.tsx";

export default function SubjectBuilder() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [current, setCurrent] = useState(0);
    const [subject, setSubject] = useState<Partial<Subject> | null>(null);

    const { data: existingSubjects } = useQuery({
        queryKey: ["subjects", id],
        queryFn: () => subjectsApi.get({ id: id! }),
        enabled: !!id,
    });

    useEffect(() => {
        if (existingSubjects?.items) {
            const found = existingSubjects.items.find((s) => String(s.id) === String(id));
            if (found) {
                setSubject(found as any);
            }
        }
    }, [existingSubjects, id]);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <SubjectDetailsStep
                        subject={subject}
                        onSuccess={(updatedSubject) => {
                            setSubject(updatedSubject);
                            next();
                        }}
                    />
                );
            case 1:
                return <LessonsStep subjectId={subject?.id || id} onNext={next} onPrev={prev} />;
            case 2:
                return <PublishStep onFinish={() => navigate("/subjects")} />;
            default:
                return null;
        }
    };

    const items = [
        { title: t("app.subjects.builder.steps.details") },
        { title: t("app.subjects.builder.steps.lessons") },
        { title: t("app.subjects.builder.steps.publish") },
    ];

    const contentStyle: React.CSSProperties = {
        marginTop: 16,
    };

    return (
        <Card title={t("app.subjects.builder.title")}>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{getStepContent(current)}</div>
        </Card>
    );
}
