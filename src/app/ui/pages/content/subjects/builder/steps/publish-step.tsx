import { Iconify } from "@/app/ui/components/icon";
import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
    onFinish: () => void;
}

export default function PublishStep({ onFinish }: Props) {
    const { t } = useTranslation();

    return (
        <Result
            status="success"
            title={t("app.subjects.builder.publishSuccess") || "Subject Setup Complete"}
            subTitle={t("app.subjects.builder.publishConfirm") || "You have successfully configured the subject and its lessons."}
            extra={[
                <Button type="primary" key="finish" onClick={onFinish} size="large">
                    {t("app.subjects.builder.finish")}
                </Button>,
            ]}
            icon={<Iconify icon="solar:verified-check-bold-duotone" size={64} className="text-success" />}
        />
    );
}
