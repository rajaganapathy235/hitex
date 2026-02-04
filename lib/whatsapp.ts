/**
 * WhatsApp Utility for sending messages via Emovur
 * Website: https://emovur.com/
 */

const WHATSAPP_OTP_URL = process.env.WHATSAPP_OTP_URL || '';
const WHATSAPP_CREDIT_URL = process.env.WHATSAPP_CREDIT_URL || '';
const WHATSAPP_DEBIT_URL = process.env.WHATSAPP_DEBIT_URL || '';

// Generic function to send data to a template-specific webhook
async function sendToWebhook(url: string, payload: any) {
    if (!url) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('WhatsApp Webhook URL not configured. Payload:', JSON.stringify(payload, null, 2));
            return { success: true, simulated: true };
        }
        return { success: false, error: 'Webhook URL not configured' };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Emovur Error:', errorText);
            return { success: false, error: `Emovur responded with ${response.status}` };
        }

        return { success: true };
    } catch (error) {
        console.error('WhatsApp Fetch Error:', error);
        return { success: false, error: 'Connection to WhatsApp service failed' };
    }
}

export async function sendOTP(phone: string, code: string) {
    // Standard Emovur payload often expects variables as keys or index
    // Note: Emovur specific payload structure usually includes the receiver number and vars
    const cleanPhone = phone.replace(/\D/g, '');
    const payload = {
        receiver: cleanPhone,
        body_vars: {
            "1": code // Assuming {{1}} is the OTP variable in the template
        }
    };
    return sendToWebhook(WHATSAPP_OTP_URL, payload);
}

export async function sendCreditNotification(phone: string, points: number, balance: number) {
    const cleanPhone = phone.replace(/\D/g, '');
    const payload = {
        receiver: cleanPhone,
        body_vars: {
            "1": points.toString(),
            "2": balance.toString()
        }
    };
    return sendToWebhook(WHATSAPP_CREDIT_URL, payload);
}

export async function sendDebitNotification(phone: string, amount: number) {
    const cleanPhone = phone.replace(/\D/g, '');
    const payload = {
        receiver: cleanPhone,
        body_vars: {
            "1": amount.toString()
        }
    };
    return sendToWebhook(WHATSAPP_DEBIT_URL, payload);
}
