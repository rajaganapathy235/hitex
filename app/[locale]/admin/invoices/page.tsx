"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAgents, addInvoice } from "@/app/actions";

interface Agent {
    id: string;
    name?: string;
    phone: string;
}

export default function AddInvoicePage() {
    const t = useTranslations("Admin");
    const common = useTranslations("Common");
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [amount, setAmount] = useState("");
    const [millName, setMillName] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getAgents().then(setAgents);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await addInvoice(selectedAgent, parseFloat(amount), millName, purchaseDate, invoiceNo);

        setLoading(false);
        if (result.success) {
            setSuccess(true);
            setAmount("");
            setMillName("");
            setInvoiceNo("");
            setPurchaseDate("");
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{t("addInvoice")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Agent</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                                required
                            >
                                <option value="">Select an agent</option>
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name || agent.phone} ({agent.phone})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mill Name</Label>
                                <Input
                                    placeholder="Enter Mill Name"
                                    value={millName}
                                    onChange={(e) => setMillName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Invoice No</Label>
                                <Input
                                    placeholder="INV-001"
                                    value={invoiceNo}
                                    onChange={(e) => setInvoiceNo(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Date of Purchase</Label>
                            <Input
                                type="date"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{common("inr")} Amount</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="0"
                            />
                        </div>

                        {success && (
                            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                                Invoice added successfully! Points credited.
                            </div>
                        )}

                        <Button type="submit" disabled={loading || !selectedAgent}>
                            {loading ? "Processing..." : common("submit")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
