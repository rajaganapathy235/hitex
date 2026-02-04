import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { getPendingWithdrawals } from "@/app/actions";
import { WithdrawalItem } from "@/components/withdrawal-item";

export default async function WithdrawalsPage() {
    const t = await getTranslations("Admin");
    const withdrawals = await getPendingWithdrawals();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("pending")}</CardTitle>
                </CardHeader>
                <CardContent>
                    {withdrawals.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            No pending requests
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {withdrawals.map((w) => (
                                <WithdrawalItem key={w.id} w={w} t={{ "process": t("process") }} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
