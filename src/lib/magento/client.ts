import { magentoConfig } from './config';

interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

class MagentoClient {
    private baseUrl: string;
    private token: string;
    private timeout: number;

    constructor() {
        this.baseUrl = magentoConfig.baseUrl;
        this.token = magentoConfig.apiToken;
        this.timeout = magentoConfig.timeout;
    }

    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }
        return url.toString();
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const { params, ...fetchOptions } = options;
        const url = this.buildUrl(endpoint, params);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers: {
                    ...this.getHeaders(),
                    ...fetchOptions.headers,
                },
                signal: controller.signal,
                cache: 'no-store',
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data as T;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }

            throw new Error('An unknown error occurred');
        }
    }

    async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
        return this.fetch<T>(endpoint, { method: 'GET', params });
    }

    async post<T>(endpoint: string, body: unknown): Promise<T> {
        return this.fetch<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async put<T>(endpoint: string, body: unknown): Promise<T> {
        return this.fetch<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.fetch<T>(endpoint, { method: 'DELETE' });
    }
}

// Singleton instance
export const magentoClient = new MagentoClient();

// Safe wrapper for API calls with fallback
export async function safeFetch<T>(
    fetchFn: () => Promise<T>,
    fallback: T
): Promise<{ data: T; error: string | null }> {
    try {
        const data = await fetchFn();
        return { data, error: null };
    } catch (error) {
        console.error('API Error:', error);
        return {
            data: fallback,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
