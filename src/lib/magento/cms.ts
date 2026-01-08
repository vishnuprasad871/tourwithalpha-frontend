import { magentoClient, safeFetch } from './client';
import { endpoints, CmsPage, CmsBlock } from './config';

// Mock data for fallback when API is not configured
const mockCmsPages: Record<string, CmsPage> = {
    'home': {
        id: 1,
        identifier: 'home',
        title: 'Welcome to Tour With Alpha',
        content: '<h1>Discover Amazing Tours</h1><p>Experience the world with our curated travel experiences.</p>',
        meta_title: 'Tour With Alpha - Your Travel Partner',
        meta_description: 'Discover amazing tour experiences with Tour With Alpha. Book your next adventure today.',
    },
    'about': {
        id: 2,
        identifier: 'about',
        title: 'About Us',
        content: `
      <h2>Our Story</h2>
      <p>Tour With Alpha was founded with a simple mission: to make travel accessible, memorable, and transformative. We believe that travel is not just about destinations—it's about the experiences, the people you meet, and the memories you create.</p>
      <h2>Our Mission</h2>
      <p>We are committed to providing exceptional travel experiences that inspire, educate, and connect people with the world around them. Our team of experienced travel experts works tirelessly to curate unique journeys that go beyond the ordinary.</p>
      <h2>Why Choose Us</h2>
      <ul>
        <li>Carefully curated experiences</li>
        <li>Expert local guides</li>
        <li>24/7 customer support</li>
        <li>Best price guarantee</li>
      </ul>
    `,
        meta_title: 'About Tour With Alpha',
        meta_description: 'Learn about Tour With Alpha and our mission to provide exceptional travel experiences.',
    },
};

const mockCmsBlocks: Record<string, CmsBlock> = {
    'hero-banner': {
        id: 1,
        identifier: 'hero-banner',
        title: 'Hero Banner',
        content: JSON.stringify({
            heading: 'Explore the World',
            subheading: 'Unforgettable journeys await you',
            buttonText: 'Book Now',
            buttonLink: '/booking',
            backgroundImage: '/images/hero-bg.jpg',
        }),
        active: true,
    },
    'promo-banners': {
        id: 2,
        identifier: 'promo-banners',
        title: 'Promo Banners',
        content: JSON.stringify([
            {
                title: 'Adventure Tours',
                description: 'Thrilling experiences for the bold',
                image: '/images/adventure.jpg',
                link: '/tours/adventure',
            },
            {
                title: 'Relaxation Retreats',
                description: 'Find your peace and tranquility',
                image: '/images/relaxation.jpg',
                link: '/tours/relaxation',
            },
            {
                title: 'Cultural Explorations',
                description: 'Immerse in rich traditions',
                image: '/images/cultural.jpg',
                link: '/tours/cultural',
            },
        ]),
        active: true,
    },
};

export async function getCmsPage(identifier: string): Promise<CmsPage | null> {
    // Try to fetch from Magento API
    const { data, error } = await safeFetch(
        () => magentoClient.get<CmsPage>(endpoints.cmsPage(identifier)),
        null
    );

    if (data) return data;

    // Fallback to mock data
    if (error) {
        console.log(`Using mock data for CMS page: ${identifier}`);
        return mockCmsPages[identifier] || null;
    }

    return null;
}

export async function getCmsBlock(identifier: string): Promise<CmsBlock | null> {
    const { data, error } = await safeFetch(
        () => magentoClient.get<CmsBlock>(endpoints.cmsBlock(identifier)),
        null
    );

    if (data) return data;

    // Fallback to mock data
    if (error) {
        console.log(`Using mock data for CMS block: ${identifier}`);
        return mockCmsBlocks[identifier] || null;
    }

    return null;
}

export async function getAllCmsPages(): Promise<CmsPage[]> {
    const { data, error } = await safeFetch(
        () => magentoClient.get<{ items: CmsPage[] }>(endpoints.cmsPages),
        { items: [] }
    );

    if (data?.items?.length) return data.items;

    // Fallback to mock data
    if (error) {
        return Object.values(mockCmsPages);
    }

    return [];
}

// Parse CMS block content that might be JSON
export function parseCmsBlockContent<T>(content: string): T | null {
    try {
        return JSON.parse(content) as T;
    } catch {
        return null;
    }
}
