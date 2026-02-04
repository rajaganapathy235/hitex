/**
 * WhatsApp Utility for sending messages via Ultramsg
 * Website: https://ultramsg.com/
 */

const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID || '';
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN || '';

// Generic function to send data to Ultramsg
async function sendToUltramsg(text: string, to: string) {
    if (!ULTRAMSG_INSTANCE_ID || !ULTRAMSG_TOKEN) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Ultramsg credentials not configured. Message:', text);
            return { success: true, simulated: true };
        }
        return { success: false, error: 'Ultramsg credentials not configured' };
    }

    try {
        const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`;
        // Ensure phone number starts with country code and has no plus
        const cleanPhone = to.replace(/\D/g, '');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                token: ULTRAMSG_TOKEN,
                to: cleanPhone,
                body: text,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ultramsg Error:', errorText);
            return { success: false, error: `Ultramsg responded with ${response.status}` };
        }

        return { success: true };
    } catch (error) {
        console.error('Ultramsg Fetch Error:', error);
        return { success: false, error: 'Connection to Ultramsg service failed' };
    }
}

export async function sendOTP(phone: string, code: string) {
    const text = `Your HITEX login OTP is: ${code}. Valid for 5 minutes.`;
    return sendToUltramsg(text, phone);
}

export async function sendCreditNotification(phone: string, points: number, balance: number) {
    const text = `Congratulations! ${points} points have been credited to your HITEX account. Your new balance is ${balance} points.`;
    return sendToUltramsg(text, phone);
}

export async function sendDebitNotification(phone: string, amount: number) {
    const text = `Your withdrawal request for ${amount} points has been processed successfully.`;
    return sendToUltramsg(text, phone);
}
