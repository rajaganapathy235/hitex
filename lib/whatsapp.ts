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
        // Ensure phone number is clean and has international format (e.g. 919876543210)
        let cleanPhone = to.replace(/\D/g, '');

        console.log(`[Whapi] Attempting to send message to: ${cleanPhone}`);

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

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Whapi Error Status:', response.status);
            console.error('Whapi Error Body:', JSON.stringify(responseData));
            return { success: false, error: responseData.error?.message || `Whapi responded with ${response.status}` };
        }

        console.log('[Whapi] Message sent successfully');
        return { success: true };
    } catch (error: any) {
        console.error('Whapi Fetch Error:', error.message);
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
