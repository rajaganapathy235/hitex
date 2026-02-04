"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { submitWithdrawal, getAgentBalance } from "@/app/actions";

export default function RedeemPage() {
    const t = useTranslations("Agent");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"gpay" | "phonepe">("gpay");
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Mock balance check
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        getAgentBalance().then(setBalance);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const val = parseInt(amount);

        if (val < 100) {
            setError(t("minRedemptionError"));
            return;
        }
        if (val > balance) {
            setError(t("insufficientBalance"));
            return;
        }

        setLoading(true);

        // Pass dummy ID or empty string, server ignores it for session user
        const result = await submitWithdrawal("", val, method, details);

        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setBalance(prev => prev - val); // Optimistic update
            setAmount("");
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError(result.error || "Failed to process");
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="text-primary-foreground/80">{t("balance")}</div>
                            <div className="text-3xl font-bold">{balance} {t("points")}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("redeem")}</CardTitle>
                    <CardDescription>{t("redeemDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t("amount")} ({t("points")})</Label>
                            <Input
                                type="number"
                                placeholder={t("minPoints", { min: 100 })}
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                                required
                                min="100"
                            />
                            <p className="text-xs text-muted-foreground">{t("rateInfo")}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("withdrawMethod")}</Label>
                            <div className="flex gap-4">
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer w-full text-center transition-all ${method === 'gpay' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'hover:bg-gray-50'}`}
                                    onClick={() => setMethod('gpay')}
                                >
                                    Google Pay
                                </div>
                                <div
                                    className={`border rounded-lg p-4 cursor-pointer w-full text-center transition-all ${method === 'phonepe' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'hover:bg-gray-50'}`}
                                    onClick={() => setMethod('phonepe')}
                                >
                                    PhonePe
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{method === 'gpay' ? t("gpay") : t("phonepe")}</Label>
                            <Input
                                type="tel"
                                placeholder="9876543210"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
                                {t("withdrawSuccess")}
                            </div>
                        )}

                        <Button className="w-full bg-primary hover:bg-primary/90" type="submit" disabled={loading || !amount}>
                            {loading ? t("processing") : t("withdraw")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
