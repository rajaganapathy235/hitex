import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/app/actions";
import { redirect } from "next/navigation";
import { HistoryList } from "@/components/history-list";

async function getHistory(agentId: string) {
    const invoices = (await db.getInvoices()).filter(i => i.agentId === agentId);
    const withdrawals = (await db.getWithdrawals()).filter(w => w.agentId === agentId);

    // Combine and sort by date
    const history = [
        ...invoices.map(i => ({
            type: 'credit',
            date: i.date,
            amount: i.points,
            id: i.id,
            details: `Invoice #${i.invoiceNo || i.id}`,
            status: 'completed',
            // New fields for detailed view
            invoiceNo: i.invoiceNo,
            millName: i.millName,
            purchaseDate: i.purchaseDate,
            inrAmount: i.amount
        })),
        ...withdrawals.map(w => ({
            type: 'debit',
            date: w.date,
            amount: w.amount,
            id: w.id,
            details: w.details, // This was `Withdrawal via ${w.method}` but simplified to details for consistency, method can be inferred or shown
            status: w.status,
            invoiceNo: undefined,
            millName: undefined,
            purchaseDate: undefined
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return history;
}

export default async function HistoryPage() {
    const t = await getTranslations("Agent");
    const user = await getCurrentUser();

    if (!user) redirect("/auth");

    const history = await getHistory(user.id);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{t("transactions")}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{t("activityLog")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <HistoryList history={history} />
                </CardContent>
            </Card>
        </div>
    );
}
