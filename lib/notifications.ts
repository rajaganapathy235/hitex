export async function sendWhatsAppNotification(phone: string, message: string) {
    // in a real app, this would call the WhatsApp Business API
    console.log(`[WhatsApp Mock] Sending to ${phone}: ${message}`);
    return true;
}

export function generateMessage(type: 'welcome' | 'otp' | 'credit' | 'withdrawal' | 'processed', params: any) {
    switch (type) {
        case 'welcome':
            return `Welcome to Retail Reward System! Your account is created.`;
        case 'credit':
            return `Your account has been credited with ${params.points} Points for invoice ${params.amount}. Current Balance: ${params.balance}`;
        case 'withdrawal':
            return `Withdrawal request for ${params.points} Points received. We will process it shortly.`;
        case 'processed':
            return `Your withdrawal of ₹${params.amount} has been processed via ${params.method}.`;
        default:
            return '';
    }
}
