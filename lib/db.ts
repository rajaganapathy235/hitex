import { supabase } from './supabase';

export interface User {
    id: string;
    phone: string;
    role: 'admin' | 'agent';
    name?: string;
    balance: number;
    createdAt: string;
}

export interface Invoice {
    id: string;
    agentId: string;
    amount: number;
    points: number;
    date: string;
    millName: string;
    purchaseDate: string;
    invoiceNo: string;
}

export interface Withdrawal {
    id: string;
    agentId: string;
    amount: number;
    method: 'gpay' | 'phonepe';
    details: string;
    status: 'pending' | 'completed';
    date: string;
}

export interface Settings {
    pointsPercentage: number;
    inrPerPoint: number;
}

export interface OTP {
    phone: string;
    code: string;
    expiresAt: string;
}

export const db = {
    getUsers: async () => {
        const { data } = await supabase.from('users').select('*');
        return (data || []) as User[];
    },
    getUserByPhone: async (phone: string) => {
        const { data } = await supabase.from('users').select('*').eq('phone', phone).single();
        return data as User | null;
    },
    createUser: async (user: User) => {
        await supabase.from('users').insert([{
            id: user.id,
            phone: user.phone,
            role: user.role,
            name: user.name,
            balance: user.balance,
            created_at: user.createdAt
        }]);
    },
    getInvoices: async () => {
        const { data } = await supabase.from('invoices').select('*');
        return (data || []).map(i => ({
            ...i,
            agentId: i.agent_id,
            invoiceNo: i.invoice_no,
            purchaseDate: i.purchase_date,
            date: i.created_at
        })) as Invoice[];
    },
    addInvoice: async (invoice: Invoice) => {
        // Start a transaction-like flow (Supabase doesn't have multi-table transactions in simple REST, so we do JS logic or RPC)
        // For simplicity here, we do it sequentially. In production, an RPC function is better.

        // 1. Insert invoice
        await supabase.from('invoices').insert([{
            id: invoice.id,
            agent_id: invoice.agentId,
            amount: invoice.amount,
            points: invoice.points,
            mill_name: invoice.millName,
            purchase_date: invoice.purchaseDate,
            invoice_no: invoice.invoiceNo,
            created_at: invoice.date
        }]);

        // 2. Update user balance
        const { data: user } = await supabase.from('users').select('balance').eq('id', invoice.agentId).single();
        if (user) {
            await supabase.from('users').update({ balance: user.balance + invoice.points }).eq('id', invoice.agentId);
        }
    },
    getWithdrawals: async () => {
        const { data } = await supabase.from('withdrawals').select('*');
        return (data || []).map(w => ({
            ...w,
            agentId: w.agent_id,
            date: w.created_at
        })) as Withdrawal[];
    },
    addWithdrawal: async (withdrawal: Withdrawal) => {
        // 1. Check and update balance
        const { data: user } = await supabase.from('users').select('balance').eq('id', withdrawal.agentId).single();
        if (!user || user.balance < withdrawal.amount) throw new Error("Insufficient balance");

        // 2. Insert withdrawal
        await supabase.from('withdrawals').insert([{
            id: withdrawal.id,
            agent_id: withdrawal.agentId,
            amount: withdrawal.amount,
            method: withdrawal.method,
            details: withdrawal.details,
            status: withdrawal.status,
            created_at: withdrawal.date
        }]);

        // 3. Update balance
        await supabase.from('users').update({ balance: user.balance - withdrawal.amount }).eq('id', withdrawal.agentId);
    },
    updateWithdrawalStatus: async (id: string, status: 'completed') => {
        await supabase.from('withdrawals').update({ status }).eq('id', id);
    },
    getSettings: async () => {
        const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (!data) return { pointsPercentage: 1, inrPerPoint: 1 };
        return {
            pointsPercentage: Number(data.points_percentage),
            inrPerPoint: Number(data.inr_per_point)
        };
    },
    updateSettings: async (settings: Partial<Settings>) => {
        const update: any = {};
        if (settings.pointsPercentage !== undefined) update.points_percentage = settings.pointsPercentage;
        if (settings.inrPerPoint !== undefined) update.inr_per_point = settings.inrPerPoint;

        await supabase.from('settings').upsert({ id: 1, ...update });
    },
    // OTP Methods
    setOTP: async (phone: string, code: string) => {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        await supabase.from('otps').upsert({
            phone,
            code,
            expires_at: expiresAt
        });
    },
    getOTP: async (phone: string) => {
        const { data: otp } = await supabase.from('otps').select('*').eq('phone', phone).single();
        if (!otp) return null;

        if (new Date() > new Date(otp.expires_at)) {
            await supabase.from('otps').delete().eq('phone', phone);
            return null;
        }

        return {
            phone: otp.phone,
            code: otp.code,
            expiresAt: otp.expires_at
        };
    },
    deleteOTP: async (phone: string) => {
        await supabase.from('otps').delete().eq('phone', phone);
    }
};
