import { functions } from './appwrite';

export async function sendMail({ to, subject, text = '', html = '' }) {
  try {
    const payload = { to, subject };
    if (text) payload.text = text;
    if (html) payload.html = html;

    const response = await functions.createExecution(
      'emailSender',
      JSON.stringify(payload)
    );

    console.log('✅ Appwrite Function Executed:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Error sending mail:', error);
    return { success: false, error };
  }
}
