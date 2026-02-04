import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Wallet, TrendingUp, History, CalendarClock } from "lucide-react";
import { getAgentStats, getCurrentUser } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function AgentDashboard() {
    const t = await getTranslations("Agent");
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth");
    }

    const stats = await getAgentStats(user.id);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{t("balance")}</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary text-primary-foreground col-span-1 md:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary-foreground/90">
                            {t("currentPoints")}
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-primary-foreground/90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{stats.balance}</div>
                        <div className="text-xs text-primary-foreground/80 mt-1">
                            {t("availableToRedeem")}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("lastMonth")}
                        </CardTitle>
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.lastMonth}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t("pointsEarned")}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("lastSixMonths")}
                        </CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.lastSixMonths}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t("pointsEarned")}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("lifetimeEarnings")}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.lifetime}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t("totalPointsEarned")}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
