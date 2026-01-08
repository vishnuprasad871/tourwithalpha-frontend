// Magento API Configuration
export const magentoConfig = {
  baseUrl: process.env.MAGENTO_BASE_URL || 'https://tourwithalpha.shop',
  apiToken: process.env.MAGENTO_API_TOKEN || '',
  timeout: 10000,
};

// API Endpoints
export const endpoints = {
  // CMS
  cmsPages: '/rest/V1/cmsPage/search',
  cmsBlocks: '/rest/V1/cmsBlock/search',
  cmsPage: (identifier: string) => `/rest/V1/cmsPage/${identifier}`,
  cmsBlock: (identifier: string) => `/rest/V1/cmsBlock/${identifier}`,
  
  // Blog (Magefan Blog Module - Common structure)
  blogPosts: '/rest/V1/blog/posts',
  blogPost: (id: string) => `/rest/V1/blog/post/${id}`,
  blogCategories: '/rest/V1/blog/categories',
  
  // Custom Seat Booking
  seats: '/rest/V1/booking/seats',
  bookings: '/rest/V1/booking/create',
  
  // Contact
  contact: '/rest/V1/contact/submit',
};

// Type definitions
export interface CmsPage {
  id: number;
  identifier: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface CmsBlock {
  id: number;
  identifier: string;
  title: string;
  content: string;
  active: boolean;
}

export interface BlogPost {
  id: number;
  identifier: string;
  title: string;
  content: string;
  short_content?: string;
  featured_image?: string;
  author?: string;
  publish_time?: string;
  meta_title?: string;
  meta_description?: string;
  categories?: string[];
}

export interface Seat {
  id: number;
  number: string;
  status: 'available' | 'booked' | 'reserved';
  price?: number;
}

export interface BookingRequest {
  seats: number[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
