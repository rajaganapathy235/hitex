/**
 * WhatsApp Utility for sending messages via WAHA (WhatsApp HTTP API)
 * Website: https://waha.devlike.pro/
 */

const WAHA_API_URL = process.env.WAHA_API_URL || '';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '';
const WAHA_SESSION = process.env.WAHA_SESSION || 'default';

// Generic function to send data to WAHA
async function sendToWaha(text: string, to: string) {
    if (!WAHA_API_URL) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('WAHA_API_URL not configured. Message:', text);
            return { success: true, simulated: true };
        }
        return { success: false, error: 'WAHA API URL not configured' };
    }

    try {
        // WAHA numbers usually need @c.us suffix
        const chatId = to.includes('@') ? to : `${to.replace(/\D/g, '')}@c.us`;

        const response = await fetch(`${WAHA_API_URL}/api/sendText`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(WAHA_API_KEY ? { 'X-Api-Key': WAHA_API_KEY } : {})
            },
            body: JSON.stringify({
                chatId,
                text,
                session: WAHA_SESSION,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('WAHA Error:', errorText);
            return { success: false, error: `WAHA responded with ${response.status}` };
        }

        return { success: true };
    } catch (error) {
        console.error('WAHA Fetch Error:', error);
        return { success: false, error: 'Connection to WAHA service failed' };
    }
}

export async function sendOTP(phone: string, code: string) {
    const text = `Your HITEX login OTP is: ${code}. Valid for 5 minutes.`;
    return sendToWaha(text, phone);
}

export async function sendCreditNotification(phone: string, points: number, balance: number) {
    const text = `Congratulations! ${points} points have been credited to your HITEX account. Your new balance is ${balance} points.`;
    return sendToWaha(text, phone);
}

export async function sendDebitNotification(phone: string, amount: number) {
    const text = `Your withdrawal request for ${amount} points has been processed successfully.`;
    return sendToWaha(text, phone);
}
