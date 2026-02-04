"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { UserPlus } from "lucide-react";
import { registerUser } from "@/app/actions";

export default function RegisterPage() {
    const t = useTranslations("Auth");
    const common = useTranslations("Common");
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setStep("otp");
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await registerUser(name, phone);
        setLoading(false);

        if (result.success && result.redirect) {
            router.push(result.redirect as any);
        } else {
            alert(result.error || "Registration failed");
            setStep("phone");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm dark:bg-black/90">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {common("register")}
                    </CardTitle>
                    <CardDescription>
                        Create a new Agent account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={step === "phone" ? handleSendOtp : handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={step === "otp" || loading}
                                required
                            />
                        </div>
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
                            {loading ? "..." : step === "phone" ? common("submit") : common("register")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-2">
                    <div className="text-sm text-center">
                        Already have an account? <Link href="/auth" className="text-primary hover:underline">{common("login")}</Link>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        Retail Reward System &copy; 2024
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
