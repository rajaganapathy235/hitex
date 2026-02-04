/**
 * WhatsApp Utility for sending messages via Whapi.cloud
 * Website: https://whapi.cloud/
 */

const WHAPI_TOKEN = process.env.WHAPI_TOKEN || '';

// Generic function to send data to Whapi.cloud
async function sendToWhapi(text: string, to: string) {
    if (!WHAPI_TOKEN) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('WHAPI_TOKEN not configured. Message:', text);
            return { success: true, simulated: true };
        }
        return { success: false, error: 'Whapi.cloud token not configured' };
    }

    try {
        // Whapi.cloud numbers usually need @s.whatsapp.net suffix or just the number
        // The API accepts both, but let's stick to the clean number if possible
        const cleanPhone = to.replace(/\D/g, '');

        const response = await fetch('https://gate.whapi.cloud/messages/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WHAPI_TOKEN}`
            },
            body: JSON.stringify({
                to: cleanPhone,
                body: text,
                typing_time: 0
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Whapi Error:', errorText);
            return { success: false, error: `Whapi responded with ${response.status}` };
        }

        return { success: true };
    } catch (error) {
        console.error('Whapi Fetch Error:', error);
        return { success: false, error: 'Connection to Whapi service failed' };
    }
}

export async function sendOTP(phone: string, code: string) {
    const text = `Your HITEX login OTP is: ${code}. Valid for 5 minutes.`;
    return sendToWhapi(text, phone);
}

export async function sendCreditNotification(phone: string, points: number, balance: number) {
    const text = `Congratulations! ${points} points have been credited to your HITEX account. Your new balance is ${balance} points.`;
    return sendToWhapi(text, phone);
}

export async function sendDebitNotification(phone: string, amount: number) {
    const text = `Your withdrawal request for ${amount} points has been processed successfully.`;
    return sendToWhapi(text, phone);
}
