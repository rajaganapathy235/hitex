import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

async function getStats() {
    const users = (await db.getUsers()).filter(u => u.role === "agent");
    const invoices = await db.getInvoices();
    const withdrawals = await db.getWithdrawals();

    const totalPoints = invoices.reduce((acc, inv) => acc + inv.points, 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length;

    return {
        agentCount: users.length,
        totalPoints,
        pendingWithdrawals,
        totalWithdrawals: withdrawals.length
    };
}

export default async function AdminDashboard() {
    const t = await getTranslations("Admin");
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Agents
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.agentCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("totalPoints")}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPoints}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("pending")}
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingWithdrawals}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Requests
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalWithdrawals}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
