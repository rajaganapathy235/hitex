"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, updateSettings } from "@/app/actions";

export default function SettingsPage() {
    const t = useTranslations("Common");
    const [pointsPercentage, setPointsPercentage] = useState("1.0");
    const [inrPerPoint, setInrPerPoint] = useState("1.0");

    useEffect(() => {
        getSettings().then(s => {
            setPointsPercentage(s.pointsPercentage.toString());
            setInrPerPoint(s.inrPerPoint.toString());
        });
    }, []);

    const handleSave = async () => {
        await updateSettings(parseFloat(pointsPercentage), parseFloat(inrPerPoint));
        alert("Settings saved!");
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Points Percentage (%)</Label>
                        <div className="text-sm text-muted-foreground mb-2">
                            Percentage of invoice amount to credit as points. (e.g., 1% of ₹1000 = 10 Points)
                        </div>
                        <Input
                            type="number"
                            step="0.1"
                            value={pointsPercentage}
                            onChange={(e) => setPointsPercentage(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>INR Value per Point (₹)</Label>
                        <div className="text-sm text-muted-foreground mb-2">
                            Redemption value of 1 point in INR.
                        </div>
                        <Input
                            type="number"
                            step="0.1"
                            value={inrPerPoint}
                            onChange={(e) => setInrPerPoint(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleSave}>{t("submit")}</Button>
                </CardContent>
            </Card>
        </div>
    );
}
