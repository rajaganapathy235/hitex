import { AgentsTable } from "@/components/agents-table";
import { getAgentsReport } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, TrendingUp, Users } from "lucide-react";

export default async function AdminAgentsPage() {
    const agents = await getAgentsReport();

    const totalPurchase = agents.reduce((sum, a) => sum + a.totalPurchase, 0);
    const totalWithdrawal = agents.reduce((sum, a) => sum + a.totalWithdrawal, 0);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{agents.length}</div>
                        <p className="text-xs text-muted-foreground">Active registered agents</p>
                    </CardContent>
                </Card>

                <Card className="border-green-600/20 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">₹{totalPurchase.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Cotton machinery spares</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-600/20 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recycling Impact</CardTitle>
                        <Recycle className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">₹{totalWithdrawal.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total rewards distributed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Agents Table */}
            <Card className="border-primary/30">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                    <div className="flex items-center gap-2">
                        <Recycle className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">Cotton Recycling Agents</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage agents and track their contributions to sustainable cotton recycling
                    </p>
                </CardHeader>
                <CardContent className="pt-6">
                    <AgentsTable agents={agents} />
                </CardContent>
            </Card>
        </div>
    );
}
