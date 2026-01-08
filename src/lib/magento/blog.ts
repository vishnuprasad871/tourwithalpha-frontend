import { magentoClient, safeFetch } from './client';
import { endpoints, BlogPost } from './config';

// Mock blog posts for fallback
const mockBlogPosts: BlogPost[] = [
    {
        id: 1,
        identifier: 'top-10-destinations-2024',
        title: 'Top 10 Travel Destinations for 2024',
        short_content: 'Discover the most breathtaking destinations that should be on your travel bucket list this year.',
        content: `
      <p>As we step into 2024, the world of travel continues to evolve, offering new and exciting destinations for adventurous souls. Here are our top picks for the year:</p>
      <h2>1. Kyoto, Japan</h2>
      <p>Experience the perfect blend of ancient traditions and modern culture in this historic city.</p>
      <h2>2. Patagonia, Argentina</h2>
      <p>For nature lovers, Patagonia offers unparalleled landscapes of glaciers, mountains, and pristine wilderness.</p>
      <h2>3. Morocco</h2>
      <p>From the bustling souks of Marrakech to the serene Sahara Desert, Morocco offers a sensory feast.</p>
    `,
        featured_image: '/images/blog/destinations.jpg',
        author: 'Travel Team',
        publish_time: '2024-01-15',
        meta_title: 'Top 10 Travel Destinations 2024 | Tour With Alpha',
        meta_description: 'Explore our curated list of must-visit travel destinations for 2024.',
        categories: ['Travel Tips', 'Destinations'],
    },
    {
        id: 2,
        identifier: 'packing-tips-essentials',
        title: 'Essential Packing Tips for Every Traveler',
        short_content: 'Learn how to pack efficiently and never forget the essentials for your next adventure.',
        content: `
      <p>Packing can make or break your travel experience. Here are expert tips to help you pack like a pro:</p>
      <h2>Roll, Don't Fold</h2>
      <p>Rolling your clothes saves space and reduces wrinkles.</p>
      <h2>The 3-1-1 Rule</h2>
      <p>Keep your liquids in containers of 3.4 oz or less, in one quart-sized bag.</p>
      <h2>Pack Versatile Items</h2>
      <p>Choose clothing that can be mixed and matched for different occasions.</p>
    `,
        featured_image: '/images/blog/packing.jpg',
        author: 'Travel Team',
        publish_time: '2024-01-10',
        meta_title: 'Packing Tips for Travelers | Tour With Alpha',
        meta_description: 'Master the art of packing with our essential travel packing guide.',
        categories: ['Travel Tips'],
    },
    {
        id: 3,
        identifier: 'sustainable-travel-guide',
        title: 'A Guide to Sustainable Travel',
        short_content: 'Travel responsibly and minimize your environmental footprint with these sustainable travel practices.',
        content: `
      <p>Sustainable travel is more than a trend—it's a responsibility. Here's how you can make a positive impact:</p>
      <h2>Choose Eco-Friendly Accommodations</h2>
      <p>Look for hotels and lodges with green certifications and sustainable practices.</p>
      <h2>Support Local Communities</h2>
      <p>Buy from local artisans, eat at local restaurants, and hire local guides.</p>
      <h2>Reduce Single-Use Plastics</h2>
      <p>Carry a reusable water bottle, shopping bag, and utensils.</p>
    `,
        featured_image: '/images/blog/sustainable.jpg',
        author: 'Travel Team',
        publish_time: '2024-01-05',
        meta_title: 'Sustainable Travel Guide | Tour With Alpha',
        meta_description: 'Learn how to travel sustainably and make a positive impact on your destinations.',
        categories: ['Sustainable Travel', 'Travel Tips'],
    },
];

export async function getBlogPosts(page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[]; total: number }> {
    const { data, error } = await safeFetch(
        () => magentoClient.get<{ items: BlogPost[]; total_count: number }>(endpoints.blogPosts, {
            'searchCriteria[currentPage]': page,
            'searchCriteria[pageSize]': limit,
        }),
        { items: [], total_count: 0 }
    );

    if (data?.items?.length) {
        return { posts: data.items, total: data.total_count };
    }

    // Fallback to mock data
    if (error) {
        console.log('Using mock blog posts');
        const start = (page - 1) * limit;
        const paginatedPosts = mockBlogPosts.slice(start, start + limit);
        return { posts: paginatedPosts, total: mockBlogPosts.length };
    }

    return { posts: [], total: 0 };
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    // Try API first
    const { data, error } = await safeFetch(
        () => magentoClient.get<BlogPost>(endpoints.blogPost(slug)),
        null
    );

    if (data) return data;

    // Fallback to mock data
    if (error) {
        console.log(`Using mock data for blog post: ${slug}`);
        return mockBlogPosts.find(post => post.identifier === slug) || null;
    }

    return null;
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const { posts } = await getBlogPosts(1, limit);
    return posts;
}

export function getAllBlogSlugs(): string[] {
    return mockBlogPosts.map(post => post.identifier);
}
