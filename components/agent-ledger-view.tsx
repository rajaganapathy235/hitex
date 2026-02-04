"use client";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LedgerItem {
    id: string;
    type: "credit" | "debit";
    date: string;
    amount: number;
    points: number;
    details: string;
    status: string;
    millName: string;
    invoiceNo: string;
}

interface AgentLedgerViewProps {
    ledger: LedgerItem[];
    isLoading: boolean;
}

export function AgentLedgerView({ ledger, isLoading }: AgentLedgerViewProps) {
    if (isLoading) {
        return <div className="p-4 text-center">Loading ledger...</div>;
    }

    if (ledger.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                No transactions found for this period.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {ledger.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-sm font-medium px-2 py-0.5 rounded",
                                        item.type === 'credit'
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    )}>
                                        {item.type === 'credit' ? 'Invoice' : 'Withdrawal'}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {format(new Date(item.date), "PPP p")}
                                    </span>
                                </div>
                                <div className="mt-1 font-medium">
                                    {item.details}
                                </div>
                                {item.type === 'credit' && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        Mill: {item.millName} | Invoice: {item.invoiceNo}
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className={cn(
                                    "font-bold text-lg",
                                    item.type === 'credit' ? "text-green-600" : "text-red-600"
                                )}>
                                    {item.type === 'credit' ? '+' : '-'}{item.points} pts
                                </div>
                                {item.status === 'completed' ? (
                                    <div className="flex items-center justify-end gap-1 text-xs text-green-600 mt-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Completed
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end gap-1 text-xs text-yellow-600 mt-1">
                                        <Clock className="h-3 w-3" />
                                        Pending
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
