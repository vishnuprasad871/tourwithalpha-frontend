/**
 * Magento REST API Client for Administrative Actions
 */

const BASE_URL = process.env.NEXT_PUBLIC_MAGENTO_BASE_URL || 'https://tourwithalpha.shop';
const REST_URL = '/api/admin';

export interface OfflineSales {
  id?: number;
  sku: string;
  booking_date: string;
  qty: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchCriteria {
  pageSize?: number;
  currentPage?: number;
  filterGroups?: any[];
  sortOrders?: any[];
}

export interface OfflineSalesSearchResults {
  items: OfflineSales[];
  search_criteria: any;
  total_count: number;
}

/**
 * Get the admin token from localStorage
 */
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

/**
 * Set the admin token in localStorage
 */
export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
}

/**
 * Remove the admin token
 */
export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
}

/**
 * Generic REST fetcher with authorization
 */
async function restFetch<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  token?: string | null
): Promise<T> {
  const authToken = token || getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${REST_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `REST request failed with status ${response.status}`;
    
    // If unauthorized, clear token
    if (response.status === 401) {
      logoutAdmin();
    }
    
    throw new Error(message);
  }

  return response.json();
}

/**
 * Admin Login: Fetch token
 */
export async function adminLogin(username: string, password: string): Promise<string> {
  const token = await restFetch<string>('/integration/admin/token', 'POST', {
    username,
    password,
  });
  setAdminToken(token);
  return token;
}

/**
 * List all bookings
 */
export async function fetchBookings(pageSize: number = 20, currentPage: number = 1): Promise<OfflineSalesSearchResults> {
  const query = `?searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${currentPage}&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC`;
  return restFetch<OfflineSalesSearchResults>(`/tourwithalpha/bookings${query}`);
}

export interface ProductListItem {
  sku: string;
  name: string;
}

export interface ProductListResponse {
  items: ProductListItem[];
}

/**
 * Fetch all active products (SKU and Name)
 */
export async function fetchProducts(): Promise<ProductListItem[]> {
  const query = `?searchCriteria[filter_groups][0][filters][0][field]=status&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&fields=items[sku,name]`;
  const data = await restFetch<ProductListResponse>(`/products${query}`);
  return data.items || [];
}

/**
 * Create or Update booking
 */
export async function saveBooking(booking: OfflineSales): Promise<OfflineSales> {
  if (booking.id) {
    // Update
    return restFetch<OfflineSales>(`/tourwithalpha/bookings/${booking.id}`, 'PUT', { booking });
  } else {
    // Create
    return restFetch<OfflineSales>('/tourwithalpha/bookings', 'POST', { booking });
  }
}

/**
 * Delete booking
 */
export async function deleteBooking(id: number): Promise<{ message: string }> {
  return restFetch<{ message: string }>(`/tourwithalpha/bookings/${id}`, 'DELETE');
}
