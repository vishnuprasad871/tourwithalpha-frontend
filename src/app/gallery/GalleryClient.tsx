'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryFolder, GalleryImage } from '@/lib/magento/graphql';
import GalleryGrid from '@/components/ui/GalleryGrid';
import { formatGalleryTitle } from '@/lib/format';

interface GalleryClientProps {
    folders: GalleryFolder[];
    initialFolder?: string;
}

export default function GalleryClient({ folders, initialFolder }: GalleryClientProps) {
    const defaultFolder = initialFolder || (folders[0]?.folder_path ?? '');
    const [activeFolder, setActiveFolder] = useState<string>(defaultFolder);
    const [activeFolderName, setActiveFolderName] = useState<string>(
        formatGalleryTitle(folders.find((f) => f.folder_path === defaultFolder)?.name ?? '')
    );
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadImages = async (folderPath: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/gallery?folder=${encodeURIComponent(folderPath)}`);
            const data = await res.json();
            setImages(data.images || []);
        } catch (e) {
            console.error('Failed to load images:', e);
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeFolder) {
            loadImages(activeFolder);
        }
    }, [activeFolder]);

    const handleFolderClick = (folder: GalleryFolder) => {
        setActiveFolder(folder.folder_path);
        setActiveFolderName(formatGalleryTitle(folder.name));
    };

    if (folders.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <div className="text-5xl mb-4">📁</div>
                <p className="text-lg">No gallery folders available yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Folder Tabs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {folders.map((folder) => {
                    const isActive = folder.folder_path === activeFolder;
                    return (
                        <button
                            key={folder.folder_path}
                            onClick={() => handleFolderClick(folder)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-sky-500 to-amber-500 border-transparent text-white shadow-lg shadow-sky-500/25'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-sky-400/50 hover:text-white'
                                }`}
                        >
                            {folder.main_image_url && (
                                <span className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={folder.main_image_url}
                                        alt={folder.name}
                                        width={20}
                                        height={20}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                </span>
                            )}
                            {formatGalleryTitle(folder.name)}
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                                    }`}
                            >
                                {folder.image_count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Folder Header */}
            {activeFolderName && (
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{activeFolderName}</h2>
                    <span className="text-gray-500 text-sm">
                        {isLoading ? 'Loading...' : `${images.length} photo${images.length !== 1 ? 's' : ''}`}
                    </span>
                </div>
            )}

            {/* Image Grid */}
            <GalleryGrid images={images} isLoading={isLoading} />
        </div>
    );
}
