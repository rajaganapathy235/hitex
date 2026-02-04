"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { processWithdrawal } from "@/app/actions";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function WithdrawalItem({ w, t }: { w: any, t: any }) {
    const [processing, setProcessing] = useState(false);

    const handleProcess = async () => {
        setProcessing(true);
        await processWithdrawal(w.id);
        setProcessing(false);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg bg-card">
            <div className="space-y-1 mb-4 md:mb-0">
                <div className="font-semibold">{w.agentName}</div>
                <div className="text-sm text-muted-foreground">{new Date(w.date).toLocaleDateString()} • {w.method}: {w.details}</div>
                <div className="font-bold text-lg">₹{w.amount}</div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                    <X className="w-4 h-4 mr-1" /> Remove
                </Button>
                <Button size="sm" onClick={handleProcess} disabled={processing}>
                    <Check className="w-4 h-4 mr-1" /> {processing ? "..." : t.process}
                </Button>
            </div>
        </div>
    );
}
