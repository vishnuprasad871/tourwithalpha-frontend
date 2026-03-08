import { Metadata } from 'next';
import { getGalleryFolders } from '@/lib/magento/graphql';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
    title: 'Gallery | Nova Scotia Tour Photos — Peggy\'s Cove, Lunenburg & More',
    description:
        'Browse stunning photos from Alpha Travel & Tours\'s Nova Scotia small-group tours — Peggy\'s Cove, UNESCO Lunenburg, Fairview Lawn Cemetery, and the Atlantic coastline.',
    alternates: { canonical: '/gallery' },
    openGraph: {
        title: 'Gallery — Alpha Travel & Tours Nova Scotia',
        description: 'Photos from our small-group tours: Peggy\'s Cove, Lunenburg & the Titanic Fairview Cemetery.',
        url: '/gallery',
    },
};

interface GalleryPageProps {
    searchParams: Promise<{ folder?: string }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
    const params = await searchParams;
    const folders = await getGalleryFolders();
    const initialFolder = params.folder || folders[0]?.folder_path || '';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
            {/* Page Header */}
            <div className="relative py-20 lg:py-28 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                        Our{' '}
                        <span className="bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">
                            Gallery
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A visual journey through Nova Scotia&apos;s stunning landscapes, historic sites, and unforgettable experiences.
                    </p>
                </div>
            </div>

            {/* Gallery Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <GalleryClient folders={folders} initialFolder={initialFolder} />
            </div>
        </div>
    );
}
