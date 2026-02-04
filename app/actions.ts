'use server';

import { db, Invoice, Withdrawal, User } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as whatsapp from "@/lib/whatsapp";

export async function requestLoginOTP(phone: string, role: 'admin' | 'agent') {
    const user = await db.getUserByPhone(phone);
    if (!user) {
        return { success: false, error: "User not found" };
    }
    if (user.role !== role) {
        return { success: false, error: "Unauthorized role" };
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in DB
    await db.setOTP(phone, otpCode);

    // Send via WhatsApp
    const result = await whatsapp.sendOTP(phone, otpCode);

    if (!result.success) {
        // Fallback for development: log to console
        console.log(`[DEV OTP] Phone: ${phone}, OTP: ${otpCode}`);
        return {
            success: true,
            warning: "WhatsApp service unavailable. OTP shown in console for dev.",
            otp: process.env.NODE_ENV === 'development' ? otpCode : undefined
        };
    }

    return { success: true };
}

export async function verifyLoginOTP(phone: string, otp: string, role: 'admin' | 'agent') {
    const storedOtp = await db.getOTP(phone);
    if (!storedOtp || storedOtp.code !== otp) {
        return { success: false, error: "Invalid or expired OTP" };
    }

    const user = await db.getUserByPhone(phone);
    if (!user || user.role !== role) {
        return { success: false, error: "Authentication failed" };
    }

    // Clear OTP after successful verification
    await db.deleteOTP(phone);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', user.id, { secure: true, httpOnly: true });
    cookieStore.set('userRole', user.role, { secure: true, httpOnly: true });

    return { success: true, redirect: role === 'admin' ? '/admin' : '/dashboard' };
}

export async function loginUser(phone: string, role: 'admin' | 'agent') {
    // Legacy support or quick login if needed
    // In production this should probably be disabled in favor of OTP
    const user = await db.getUserByPhone(phone);
    if (!user) {
        return { success: false, error: "User not found" };
    }
    if (user.role !== role) {
        return { success: false, error: "Invalid role" };
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', user.id, { secure: true, httpOnly: true });
    cookieStore.set('userRole', user.role, { secure: true, httpOnly: true });

    return { success: true, redirect: role === 'admin' ? '/admin' : '/dashboard' };
}

export async function registerUser(name: string, phone: string) {
    const existing = await db.getUserByPhone(phone);
    if (existing) {
        return { success: false, error: "User already exists" };
    }

    const newUser: User = {
        id: Math.random().toString(36).substring(7),
        phone,
        name,
        role: 'agent',
        balance: 0,
        createdAt: new Date().toISOString()
    };

    await db.createUser(newUser);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', newUser.id, { secure: true, httpOnly: true });
    cookieStore.set('userRole', 'agent', { secure: true, httpOnly: true });

    return { success: true, redirect: '/dashboard' };
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    cookieStore.delete('userRole');
    redirect('/auth');
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return null;
    return (await db.getUsers()).find((u: any) => u.id === userId);
}


export async function submitWithdrawal(agentId: string, amount: number, method: 'gpay' | 'phonepe', details: string) {
    // Security: Always use the session ID if available, ignore the passed ID if it conflicts (or just ignore passed ID)
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const withdrawal: Withdrawal = {
            id: Math.random().toString(36).substring(7),
            agentId: userId, // Use session ID
            amount,
            method,
            details,
            status: 'pending',
            date: new Date().toISOString()
        };

        await db.addWithdrawal(withdrawal);
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/history');
        revalidatePath('/admin/withdrawals');
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getAgentBalance(agentId?: string) {
    // If no ID provided, try session
    const cookieStore = await cookies();
    const targetId = agentId || cookieStore.get('userId')?.value;
    if (!targetId) return 0;

    const user = (await db.getUsers()).find((u: any) => u.id === targetId);
    return user ? user.balance : 0;
}

export async function getPendingWithdrawals() {
    const withdrawals = (await db.getWithdrawals()).filter((w: any) => w.status === 'pending');
    // Enrich with agent names
    const users = await db.getUsers();
    return withdrawals.map((w: any) => {
        const agent = users.find((u: any) => u.id === w.agentId);
        return {
            ...w,
            agentName: agent ? agent.name || agent.phone : 'Unknown Agent'
        };
    });
}

export async function processWithdrawal(id: string) {
    try {
        const withdrawal = (await db.getWithdrawals()).find((w: any) => w.id === id);
        if (!withdrawal) return { success: false, error: "Withdrawal not found" };

        await db.updateWithdrawalStatus(id, 'completed');

        // Send WhatsApp Notification for Debit
        const user = (await db.getUsers()).find((u: any) => u.id === withdrawal.agentId);
        if (user) {
            await whatsapp.sendDebitNotification(user.phone, withdrawal.amount);
        }

        revalidatePath('/admin/withdrawals');
        revalidatePath('/dashboard/history');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to process" };
    }
}

export async function getAgents() {
    return (await db.getUsers()).filter((u: any) => u.role === 'agent');
}

export async function addInvoice(agentId: string, amount: number, millName: string, purchaseDate: string, invoiceNo: string) {
    try {
        const settings = await db.getSettings();
        const points = amount * (settings.pointsPercentage / 100);

        const invoice: Invoice = {
            id: Math.random().toString(36).substring(7),
            agentId,
            amount,
            points: Math.floor(points),
            date: new Date().toISOString(),
            millName,
            purchaseDate,
            invoiceNo
        };

        await db.addInvoice(invoice);

        // Fetch user to get updated balance for notification
        const user = (await db.getUsers()).find((u: any) => u.id === agentId);
        if (user) {
            await whatsapp.sendCreditNotification(user.phone, invoice.points, user.balance);
        }

        revalidatePath('/admin');
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/history');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to add invoice" };
    }
}

export async function updateSettings(pointsPercentage: number, inrPerPoint: number) {
    try {
        await db.updateSettings({ pointsPercentage, inrPerPoint });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update settings" };
    }
}

export async function getSettings() {
    return await db.getSettings();
}

export async function getAgentStats(agentId: string) {
    const user = (await db.getUsers()).find((u: any) => u.id === agentId);
    if (!user) return { balance: 0, lifetime: 0, lastMonth: 0, lastSixMonths: 0 };

    const invoices = (await db.getInvoices()).filter((i: any) => i.agentId === agentId);
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    const lifetime = invoices.reduce((acc, inv) => acc + inv.points, 0);

    const lastMonth = invoices
        .filter(i => new Date(i.date) >= oneMonthAgo)
        .reduce((acc, inv) => acc + inv.points, 0);

    const lastSixMonths = invoices
        .filter(i => new Date(i.date) >= sixMonthsAgo)
        .reduce((acc, inv) => acc + inv.points, 0);

    return {
        balance: user.balance,
        lifetime,
        lastMonth,
        lastSixMonths
    };
}

export async function getAdminLedger() {
    const invoices = await db.getInvoices();
    const withdrawals = await db.getWithdrawals();
    const users = await db.getUsers();

    const ledger = [
        ...invoices.map((i: any) => {
            const agent = users.find((u: any) => u.id === i.agentId);
            return {
                id: i.id,
                type: 'credit' as const,
                date: i.date,
                amount: i.amount,
                points: i.points,
                agentName: agent ? agent.name || agent.phone : 'Unknown',
                details: `Invoice #${i.invoiceNo || i.id}`,
                status: 'completed',
                millName: i.millName || '-'
            };
        }),
        ...withdrawals.map((w: any) => {
            const agent = users.find((u: any) => u.id === w.agentId);
            return {
                id: w.id,
                type: 'debit' as const,
                date: w.date,
                amount: w.amount,
                points: w.amount, // Points debited
                agentName: agent ? agent.name || agent.phone : 'Unknown',
                details: `${w.method}: ${w.details}`,
                status: w.status,
                millName: '-'
            };
        })
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return ledger;
}

export interface AgentSummary {
    id: string;
    name: string;
    phone: string;
    totalPurchase: number;
    totalWithdrawal: number;
    balance: number;
    mills: string[];
}

export async function getAgentsReport(startDate?: Date, endDate?: Date) {
    const users = (await db.getUsers()).filter((u: any) => u.role === 'agent');
    const allInvoices = await db.getInvoices();
    const allWithdrawals = await db.getWithdrawals();

    const report: AgentSummary[] = users.map((user: any) => {
        let userInvoices = allInvoices.filter((i: any) => i.agentId === user.id);
        let userWithdrawals = allWithdrawals.filter((w: any) => w.agentId === user.id);

        if (startDate) {
            userInvoices = userInvoices.filter((i: any) => new Date(i.date) >= startDate);
            userWithdrawals = userWithdrawals.filter((w: any) => new Date(w.date) >= startDate);
        }
        if (endDate) {
            // Adjust endDate to include the full day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            userInvoices = userInvoices.filter((i: any) => new Date(i.date) <= end);
            userWithdrawals = userWithdrawals.filter((w: any) => new Date(w.date) <= end);
        }

        const totalPurchase = userInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);
        const totalWithdrawal = userWithdrawals.filter((w: any) => w.status === 'completed').reduce((sum: number, w: any) => sum + w.amount, 0);

        const mills = Array.from(new Set(userInvoices.map((i: any) => i.millName).filter(Boolean)));

        return {
            id: user.id,
            name: user.name || '',
            phone: user.phone,
            totalPurchase,
            totalWithdrawal,
            balance: user.balance,
            mills
        };
    });

    return report;
}

export async function getAgentLedger(agentId: string, startDate?: Date, endDate?: Date) {
    const allInvoices = (await db.getInvoices()).filter((i: any) => i.agentId === agentId);
    const allWithdrawals = (await db.getWithdrawals()).filter((w: any) => w.agentId === agentId);

    let invoices = allInvoices;
    let withdrawals = allWithdrawals;

    if (startDate) {
        invoices = invoices.filter((i: any) => new Date(i.date) >= startDate);
        withdrawals = withdrawals.filter((w: any) => new Date(w.date) >= startDate);
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        invoices = invoices.filter((i: any) => new Date(i.date) <= end);
        withdrawals = withdrawals.filter((w: any) => new Date(w.date) <= end);
    }

    const ledger = [
        ...invoices.map((i: any) => ({
            id: i.id,
            type: 'credit' as const,
            date: i.date,
            amount: i.amount,
            points: i.points,
            details: `Invoice #${i.invoiceNo || i.id}`,
            status: 'completed',
            millName: i.millName || '-',
            invoiceNo: i.invoiceNo
        })),
        ...withdrawals.map((w: any) => ({
            id: w.id,
            type: 'debit' as const,
            date: w.date,
            amount: w.amount,
            points: w.amount, // Points debited
            details: `${w.method}: ${w.details}`,
            status: w.status,
            millName: '-',
            invoiceNo: '-'
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return ledger;
}
