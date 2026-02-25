import { NextRequest, NextResponse } from 'next/server';
import { getDirectoryImages } from '@/lib/magento/graphql';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
        return NextResponse.json({ error: 'folder parameter is required' }, { status: 400 });
    }

    try {
        const images = await getDirectoryImages(folder);
        return NextResponse.json({ images });
    } catch (error) {
        console.error('Gallery API error:', error);
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }
}
