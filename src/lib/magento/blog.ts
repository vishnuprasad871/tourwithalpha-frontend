// Blog GraphQL API Client
import { graphqlFetch } from './graphql';

// Blog Post Types
export interface BlogTopic {
    name: string;
    topic_id: number;
}

export interface BlogPost {
    post_id: number;
    name: string;
    url_key: string;
    author_name: string | null;
    enabled: number;
    image: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    meta_robots: string | null;
    meta_title: string | null;
    post_content: string;
    publish_date: string;
    store_ids: string | null;
    updated_at: string;
    topics?: {
        items: BlogTopic[];
    };
}

export interface PageInfo {
    currentPage: number;
    endPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    startPage: number;
}

export interface BlogPostsResponse {
    mpBlogPosts: {
        items: BlogPost[];
        pageInfo: PageInfo;
        total_count: number;
    };
}

export interface BlogPostDetailResponse {
    mpBlogPosts: {
        items: BlogPost[];
    };
}

// Get blog posts list
export async function getBlogPosts(
    page: number = 1,
    pageSize: number = 10
): Promise<{ posts: BlogPost[]; total: number; pageInfo: PageInfo | null }> {
    const query = `
        query GetBlogPosts($pageSize: Int!, $currentPage: Int!) {
            mpBlogPosts(
                action: "get_post_list"
                pageSize: $pageSize
                currentPage: $currentPage
            ) {
                items {
                    post_id
                    author_name
                    enabled
                    image
                    meta_description
                    meta_keywords
                    meta_robots
                    meta_title
                    name
                    post_content
                    publish_date
                    store_ids
                    topics {
                        items {
                            name
                            topic_id
                        }
                    }
                    updated_at
                    url_key
                }
                pageInfo {
                    currentPage
                    endPage
                    hasNextPage
                    hasPreviousPage
                    pageSize
                    startPage
                }
                total_count
            }
        }
    `;

    try {
        const data = await graphqlFetch<BlogPostsResponse>(query, {
            pageSize,
            currentPage: page,
        });

        return {
            posts: data.mpBlogPosts.items || [],
            total: data.mpBlogPosts.total_count || 0,
            pageInfo: data.mpBlogPosts.pageInfo || null,
        };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return { posts: [], total: 0, pageInfo: null };
    }
}

// Get single blog post by URL key
export async function getBlogPost(urlKey: string): Promise<BlogPost | null> {
    const query = `
        query GetBlogPost($urlKey: String!) {
            mpBlogPosts(
                action: "get_post_list"
                pageSize: 1
                filter: {
                    url_key: {
                        eq: $urlKey
                    }
                }
                currentPage: 1
            ) {
                items {
                    post_id
                    author_name
                    enabled
                    image
                    meta_description
                    meta_keywords
                    meta_robots
                    meta_title
                    name
                    post_content
                    publish_date
                    store_ids
                    topics {
                        items {
                            name
                            topic_id
                        }
                    }
                    updated_at
                    url_key
                }
            }
        }
    `;

    try {
        const data = await graphqlFetch<BlogPostDetailResponse>(query, { urlKey });
        return data.mpBlogPosts.items?.[0] || null;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

// Get related posts for a blog post
export async function getRelatedPosts(
    postId: number,
    pageSize: number = 3
): Promise<BlogPost[]> {
    const query = `
        query GetRelatedPosts($postId: Int!, $pageSize: Int!) {
            mpBlogPosts(
                action: "get_related_post"
                pageSize: $pageSize
                postId: $postId
                currentPage: 1
            ) {
                items {
                    post_id
                    author_name
                    enabled
                    image
                    meta_description
                    meta_keywords
                    meta_robots
                    meta_title
                    name
                    post_content
                    publish_date
                    store_ids
                    topics {
                        items {
                            name
                            topic_id
                        }
                    }
                    updated_at
                    url_key
                }
            }
        }
    `;

    try {
        const data = await graphqlFetch<BlogPostDetailResponse>(query, {
            postId,
            pageSize,
        });
        return data.mpBlogPosts.items || [];
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}

// Get featured posts (just first few posts)
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const { posts } = await getBlogPosts(1, limit);
    return posts;
}
