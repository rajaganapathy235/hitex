"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { UserCheck, ShieldCheck, AlertCircle } from "lucide-react";
import { requestLoginOTP, verifyLoginOTP } from "@/app/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
    const t = useTranslations("Auth");
    const common = useTranslations("Common");
    const router = useRouter();
    const [role, setRole] = useState<"agent" | "admin">("agent");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setWarning(null);

        const result = await requestLoginOTP(phone, role);
        setLoading(false);

        if (result.success) {
            setStep("otp");
            if (result.warning) setWarning(result.warning);
        } else {
            setError(result.error || "Failed to send OTP");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await verifyLoginOTP(phone, otp, role);
        setLoading(false);

        if (result.success && result.redirect) {
            router.push(result.redirect);
        } else {
            setError(result.error || "Verification failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="fixed top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-black/90">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            {role === "agent" ? (
                                <UserCheck className="w-8 h-8 text-primary" />
                            ) : (
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            )}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {role === "agent" ? t("agentLogin") : t("adminLogin")}
                    </CardTitle>
                    <CardDescription>
                        {common("welcome")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
                        <button
                            onClick={() => { setRole("agent"); setStep("phone"); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "agent"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t("agentLogin")}
                        </button>
                        <button
                            onClick={() => { setRole("admin"); setStep("phone"); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "admin"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t("adminLogin")}
                        </button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {warning && (
                        <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-500">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Notice</AlertTitle>
                            <AlertDescription>{warning}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={step === "phone" ? handleSendOtp : handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("phone")}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={step === "otp" || loading}
                                required
                            />
                        </div>
                        {step === "otp" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                <Label htmlFor="otp">{t("otp")}</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        )}

                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "..." : step === "phone" ? t("sendOtp") : t("verify")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-muted-foreground">
                    Retail Reward System &copy; 2024
                </CardFooter>
            </Card>
        </div>
    );
}
