"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getAdminLedger } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LedgerItem {
    id: string;
    type: 'credit' | 'debit';
    date: string;
    amount: number;
    points: number;
    agentName: string;
    details: string;
    status: string;
    millName: string;
}

export default function LedgerPage() {
    const t = useTranslations("Admin");
    const [ledger, setLedger] = useState<LedgerItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getAdminLedger().then(setLedger);
    }, []);

    const filteredLedger = ledger.filter(item =>
        item.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.millName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("ledger")}</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search agent, invoice..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredLedger.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">No transactions found</div>
                        ) : (
                            <div className="rounded-md border">
                                <div className="grid grid-cols-7 gap-4 p-4 font-medium bg-muted/50 text-sm">
                                    <div>Date</div>
                                    <div className="col-span-2">Agent</div>
                                    <div className="col-span-1">Details</div>
                                    <div className="text-right">Amount (INR)</div>
                                    <div className="text-right">Points</div>
                                    <div className="text-right">Status</div>
                                </div>
                                <div className="divide-y">
                                    {filteredLedger.map((item) => (
                                        <div key={item.id} className="grid grid-cols-7 gap-4 p-4 text-sm items-center hover:bg-muted/5 transition-colors">
                                            <div className="text-muted-foreground">{new Date(item.date).toLocaleDateString()}</div>
                                            <div className="font-medium col-span-2">{item.agentName}</div>
                                            <div className="flex items-center gap-2 col-span-1">
                                                {item.type === 'credit' ? (
                                                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <ArrowUpRight className="h-4 w-4 text-orange-500" />
                                                )}
                                                <span className="truncate" title={item.details}>{item.details}</span>
                                            </div>
                                            <div className="text-right font-medium">₹{item.amount}</div>
                                            <div className={`text-right font-bold ${item.type === 'credit' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {item.type === 'credit' ? '+' : '-'}{item.type === 'credit' ? item.points : item.amount}
                                            </div>
                                            <div className="text-right capitalize text-xs text-muted-foreground">
                                                {item.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
