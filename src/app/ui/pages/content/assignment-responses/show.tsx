import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Skeleton, Space, Tag, Typography } from "antd";
import { toast } from "sonner";

import responsesApi from "@/app/api/services/assignment-responses";
import assignmentsApi from "@/app/api/services/assignments";
import { Iconify } from "@/app/ui/components/icon";
import { useNavigate, useParams } from "react-router";

const { Title, Text, Paragraph } = Typography;

export default function GradeResponsePage() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { responseId } = useParams<{ responseId: string }>();

    // Fetch the detailed student response
    const { data: responseData, isLoading: isLoadingResponse } = useQuery({
        queryKey: ['assignment-response', responseId],
        queryFn: () => responsesApi.show(responseId!),
        enabled: !!responseId,
    });

    // Fetch the original assignment form once we have the assignmentId from the response
    const assignmentId = responseData?.assignmentId;
    const { data: assignmentData, isLoading: isLoadingAssignment } = useQuery({
        queryKey: ['assignment-details', assignmentId],
        queryFn: () => assignmentsApi.show(assignmentId!),
        enabled: !!assignmentId,
    });

    // Mutation to submit the manual grades
    const mutationGrade = useMutation({
        mutationFn: (values: { scores: Record<string, number>; notes?: string }) => 
            responsesApi.grade(responseId!, values),
        onSuccess: () => {
            toast.success(t('app.assignmentResponses.grade-saved-successfully'));
            // Navigate back to the list of responses for that assignment
            navigate(`/assignments/${assignmentId}/responses`);
        },
        onError: (_error: any) => {
            // error already displayed by http client
            // toast.error(error?.response?.data?.message || t('common.error-occurred'));
        }
    });

    const onFinish = (values: { notes: string; [key: string]: any }) => {
        const { notes, ...scores } = values;
        mutationGrade.mutate({ scores, notes });
    };

    // --- RENDER LOGIC ---
    if (isLoadingResponse || isLoadingAssignment) {
        return <Card><Skeleton active /></Card>;
    }

    if (!responseData || !assignmentData) {
        return <Card>{t('common.no-data')}</Card>;
    }

    // Flatten all question elements from the assignment form for easy lookup
    const allQuestions = assignmentData.form.slides.flatMap((slide: any) => slide.elements)
        .filter((el: any) => el.question); // Only include elements that are actual questions

    return (
        <Space direction="vertical" size="large" className="w-full">
            <Card>
                <Title level={4}>{t('app.assignmentResponses.grading-submission-for')} {responseData.student.name}</Title>
                <Text type="secondary">{assignmentData.title}</Text>
            </Card>

            <Form form={form} onFinish={onFinish} layout="vertical">
                {allQuestions.map((question: any, index: any) => (
                    <Card key={question.id} title={`${t('app.fields.question')} ${index + 1}`} style={{ marginBottom: 16 }}>
                        <Paragraph strong>{question.question}</Paragraph>
                        {responseData.individualScores[question.id] !== question.score && question.answer && 
                        <div style={{ width:'fit-content', background: '#f6ffed', border: '1px solid #b7eb8f', padding: '8px', borderRadius: '4px', marginBottom: '12px' }}>
                            <Text strong type="success">{t('app.assignmentResponses.correct-answer')}: </Text>
                            <Text type="success">{formatAnswer(question.answer)}</Text>
                        </div>}
                        <Divider style={{ margin: '12px 0' }} />
                        <Row gutter={16} align="middle">
                            <Col span={12}>
                                <Text strong>{t('app.assignmentResponses.student-answer')}:</Text>
                                <Paragraph className={!(responseData.individualScores[question.id] > 0) ? "line-through" :''}>
                                    {/* Display the student's answer */}
                                    {formatAnswer(responseData.replies[question.id]) || <Text type="secondary">No answer</Text>}
                                </Paragraph>
                            </Col>
                            <Col span={12}>
                                {isAutoGradable(question.type) ? (
                                    // Display for auto-graded questions
                                    <Space direction="vertical">
                                        <Text strong>{t('app.assignmentResponses.auto-grade')}:</Text>
                                        <Tag 
                                            color={responseData.individualScores[question.id] > 0 ? 'green' : 'red'}
                                            icon={responseData.individualScores[question.id] > 0 ? <Iconify icon="solar:check-circle-bold" /> : <Iconify icon="solar:close-circle-bold" />}
                                        >
                                            {responseData.individualScores[question.id] || 0} / {question.score}
                                        </Tag>
                                    </Space>
                                ) : (
                                    // Input for manually graded questions
                                    <Form.Item
                                        label={<Text strong>{t('app.assignmentResponses.enter-score')}:</Text>}
                                        name={question.id}
                                        initialValue={responseData.individualScores[question.id] || 0}
                                        rules={[{
                                            type: 'number',
                                            min: 0,
                                            max: question.score,
                                            message: t('app.assignmentResponses.score-out-of-range', { max: question.score })
                                        }]}
                                    >
                                        <InputNumber min={0} max={question.score} addonAfter={`/ ${question.score}`} />
                                    </Form.Item>
                                )}
                            </Col>
                            {/* <Col xs={24} md={12}>
                                <Form.Item
                                    label={<Text strong>{t('app.assignmentResponses.enter-score')}:</Text>}
                                    name={question.id}
                                    // The initial value is always the score from the database
                                    initialValue={responseData.individualScores[question.id] || 0}
                                    rules={[{
                                        type: 'number',
                                        min: 0,
                                        max: question.score,
                                        message: t('app.assignmentResponses.score-out-of-range', { max: question.score })
                                    }]}
                                >
                                    <InputNumber min={0} max={question.score} addonAfter={`/ ${question.score}`} />
                                </Form.Item>
                            </Col> */}
                        </Row>
                    </Card>
                ))}
                
                <Card title={t('app.assignmentResponses.final-notes-and-submission')}>
                     <Form.Item label={t('app.fields.notes')} name="notes" initialValue={responseData.notes}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={mutationGrade.isPending}>
                            {t('app.assignmentResponses.save-final-grade')}
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </Space>
    );
}

// Helper function to determine if a question is subjective
function isAutoGradable(type: string): boolean {
    return ['choice', 'select', 'number', 'true-false'].includes(type);
}
// A utility to nicely format answers, whether they are strings, numbers, or arrays.
function formatAnswer(answer: any): string {
    if (answer === undefined || answer === null) {
        return '-';
    }
    if (Array.isArray(answer)) {
        return answer.join(', ');
    }
    return String(answer);
}