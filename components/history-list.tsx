"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

interface HistoryItem {
    id: string;
    type: string;
    date: string;
    amount: number;
    details: string;
    status: string;
    invoiceNo?: string;
    millName?: string;
    purchaseDate?: string;
    inrAmount?: number;
}

export function HistoryList({ history }: { history: HistoryItem[] }) {
    const t = useTranslations("Agent");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    if (history.length === 0) {
        return <div className="text-center text-muted-foreground py-8">{t("noTransactions")}</div>;
    }

    return (
        <div className="space-y-4">
            {history.map((item) => (
                <div key={item.id} className="border rounded-xl hover:bg-muted/50 transition-colors overflow-hidden">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleExpand(item.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${item.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {item.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="font-semibold flex items-center gap-2">
                                    {item.type === 'credit' ? t("pointsCredited") : t("withdrawalRequest")}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedIds.has(item.id) ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {item.type === 'credit' ? t("invoiceId", { id: item.invoiceNo || item.id }) : t("withdrawalMethod", { method: item.type === 'debit' ? (item.details.includes(':') ? item.details.split(':')[0] : item.details) : '' })}
                                    • {new Date(item.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`font-bold ${item.type === 'credit' ? 'text-green-600' : 'text-orange-600'}`}>
                                {item.type === 'credit' ? '+' : '-'}{item.amount}
                            </div>
                            {item.type === 'debit' && (
                                <div className="text-xs text-muted-foreground capitalize flex items-center justify-end gap-1">
                                    {item.status === 'pending' && <Clock className="w-3 h-3" />}
                                    {t(item.status)}
                                </div>
                            )}
                        </div>
                    </div>

                    {expandedIds.has(item.id) && (
                        <div className="bg-muted/50 p-4 pt-0 text-sm grid grid-cols-2 gap-2 animate-in slide-in-from-top-2">
                            <div className="col-span-2 border-t my-2"></div>

                            {item.type === 'credit' ? (
                                <>
                                    <div className="text-muted-foreground">{t("millName")}:</div>
                                    <div className="font-medium text-right">{item.millName || "-"}</div>

                                    <div className="text-muted-foreground">{t("invoiceNo")}:</div>
                                    <div className="font-medium text-right">{item.invoiceNo || "-"}</div>

                                    <div className="text-muted-foreground">{t("purchaseDate")}:</div>
                                    <div className="font-medium text-right">{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : "-"}</div>

                                    <div className="text-muted-foreground">{t("amount")}:</div>
                                    <div className="font-medium text-right">₹{item.inrAmount}</div>

                                    <div className="text-muted-foreground">{t("points")}:</div>
                                    <div className="font-medium text-right">{item.amount}</div>
                                </>
                            ) : (
                                <>
                                    <div className="text-muted-foreground">{t("withdrawMethod")}:</div>
                                    <div className="font-medium text-right capitalize">{item.details.includes(':') ? item.details.split(':')[0] : 'GPay/PhonePe'}</div>

                                    <div className="text-muted-foreground">{t("details")}:</div>
                                    <div className="font-medium text-right">{item.details}</div>

                                    <div className="text-muted-foreground">{t("points")}:</div>
                                    <div className="font-medium text-right">{item.amount}</div>

                                    <div className="text-muted-foreground">{t("creditedAmount")}:</div>
                                    <div className="font-medium text-right">₹{item.amount}</div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
