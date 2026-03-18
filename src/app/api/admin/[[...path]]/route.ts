import { NextRequest, NextResponse } from 'next/server';

const MAGENTO_BASE_URL = process.env.MAGENTO_BASE_URL || 'https://tourwithalpha.shop';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(request, await params);
}

async function handleProxy(request: NextRequest, params: { path?: string[] }) {
  const path = params.path?.join('/') || '';
  const searchParams = request.nextUrl.searchParams.toString();
  const magentoUrl = `${MAGENTO_BASE_URL}/rest/V1/${path}${searchParams ? `?${searchParams}` : ''}`;

  console.log(`Proxying to: ${magentoUrl}`);

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Forward relevant headers, especially Authorization
    if (['authorization', 'content-type', 'accept'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  try {
    const body = ['POST', 'PUT'].includes(request.method) ? await request.text() : undefined;

    const response = await fetch(magentoUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error via Proxy', error: error.message }, { status: 500 });
  }
}
