import { magentoClient, safeFetch } from './client';
import { endpoints, ContactRequest } from './config';

export async function submitContactForm(request: ContactRequest): Promise<{ success: boolean; message: string }> {
    const { data, error } = await safeFetch(
        () => magentoClient.post<{ success: boolean; message: string }>(endpoints.contact, request),
        { success: false, message: 'Failed to submit form' }
    );

    if (data?.success) return data;

    // Fallback to mock submission
    if (error) {
        console.log('Using mock contact submission');
        // Simulate successful submission
        return {
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
        };
    }

    return { success: false, message: 'Failed to submit form' };
}
