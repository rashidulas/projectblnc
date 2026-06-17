import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const ALLOWED = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png', 'image/avif'];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const form = await request.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);
    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });

    const paths: string[] = [];
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: `File too large (max 10MB): ${file.name}` }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = (file.name.split('.').pop() || 'webp').toLowerCase().replace(/[^a-z0-9]/g, '');
      const base =
        file.name
          .replace(/\.[^.]+$/, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40) || 'img';
      const fname = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      await writeFile(path.join(dir, fname), buffer);
      paths.push(`/uploads/${fname}`);
    }

    return NextResponse.json({ paths });
  } catch (e) {
    console.error('upload failed:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
