"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AgentSummary, getAgentLedger } from "@/app/actions";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AgentLedgerView } from "@/components/agent-ledger-view";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AgentsTableProps {
    agents: AgentSummary[];
    initialDateRange?: DateRange;
}

export function AgentsTable({ agents, initialDateRange }: AgentsTableProps) {
    const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null);
    const [ledger, setLedger] = useState<Awaited<ReturnType<typeof getAgentLedger>>>([]);
    const [isLoadingLedger, setIsLoadingLedger] = useState(false);
    const [ledgerDateRange, setLedgerDateRange] = useState<DateRange | undefined>(initialDateRange);

    const handleViewLedger = async (agent: AgentSummary) => {
        setSelectedAgent(agent);
        setLedgerDateRange(initialDateRange); // Reset to page filter or default
        await fetchLedger(agent.id, initialDateRange);
    };

    const fetchLedger = async (agentId: string, range?: DateRange) => {
        setIsLoadingLedger(true);
        try {
            const data = await getAgentLedger(
                agentId,
                range?.from,
                range?.to
            );
            setLedger(data);
        } catch (error) {
            console.error("Failed to fetch ledger", error);
        } finally {
            setIsLoadingLedger(false);
        }
    };

    const handleLedgerDateChange = async (range: DateRange | undefined) => {
        setLedgerDateRange(range);
        if (selectedAgent) {
            await fetchLedger(selectedAgent.id, range);
        }
    };

    return (
        <>
            <div className="rounded-md border border-primary/20">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 hover:bg-primary/5">
                            <TableHead className="font-semibold">Agent Name</TableHead>
                            <TableHead className="font-semibold">Mills</TableHead>
                            <TableHead className="text-right font-semibold">Total Purchase (₹)</TableHead>
                            <TableHead className="text-right font-semibold">Total Withdrawal (₹)</TableHead>
                            <TableHead className="text-right font-semibold">Current Balance (Pts)</TableHead>
                            <TableHead className="text-center font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {agents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No agents found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            agents.map((agent) => (
                                <TableRow key={agent.id} className="hover:bg-primary/5">
                                    <TableCell className="font-medium">
                                        <div>{agent.name}</div>
                                        <div className="text-xs text-muted-foreground">{agent.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {agent.mills.length > 0 ? agent.mills.map(mill => (
                                                <span key={mill} className="px-2 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium rounded-md text-xs border border-primary/30">
                                                    {mill}
                                                </span>
                                            )) : <span className="text-muted-foreground text-xs">-</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-green-700 dark:text-green-400 font-semibold">
                                        ₹{agent.totalPurchase.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-orange-600 dark:text-orange-400 font-semibold">
                                        ₹{agent.totalWithdrawal.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-primary text-lg">
                                        {agent.balance}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewLedger(agent)}
                                            className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
                                        >
                                            View Ledger
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Ledger: {selectedAgent?.name}</DialogTitle>
                        <DialogDescription>
                            Transaction history for {selectedAgent?.phone}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end mb-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[300px] justify-start text-left font-normal",
                                        !ledgerDateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {ledgerDateRange?.from ? (
                                        ledgerDateRange.to ? (
                                            <>
                                                {format(ledgerDateRange.from, "LLL dd, y")} -{" "}
                                                {format(ledgerDateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(ledgerDateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={ledgerDateRange?.from}
                                    selected={ledgerDateRange}
                                    onSelect={handleLedgerDateChange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <AgentLedgerView ledger={ledger} isLoading={isLoadingLedger} />
                </DialogContent>
            </Dialog>
        </>
    );
}
