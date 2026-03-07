import { graphqlFetch } from './graphql';

// Contact Us Types
export interface ContactUsInput {
    name: string;
    email: string;
    telephone?: string;
    comment: string;
}

export interface ContactUsResponse {
    contactUs: boolean;
}

// Submit contact form via GraphQL API
export async function submitContactForm(
    data: { name: string; email: string; phone?: string; message: string }
): Promise<{ success: boolean; message: string }> {
    const mutation = `
        mutation ContactUs($input: ContactUsInput!) {
            contactUs(input: $input)
        }
    `;

    const input: ContactUsInput = {
        name: data.name,
        email: data.email,
        telephone: data.phone || '',
        comment: data.message,
    };

    try {
        const response = await graphqlFetch<ContactUsResponse>(mutation, { input });

        const isSuccess = response.contactUs === true;

        return {
            success: isSuccess,
            message: isSuccess
                ? 'Thank you for your message! We will get back to you soon.'
                : 'Failed to submit form. Please try again.',
        };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
        };
    }
}
