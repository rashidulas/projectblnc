import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

const ALLOWED_IMAGE_TYPES = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

function getBucket(mimeType: string): string | null {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'product-images';
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'product-videos';
  return null;
}

export async function POST(request: NextRequest) {
  const ok = await getAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const form = await request.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);
    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const paths: string[] = [];

    for (const file of files) {
      const bucket = getBucket(file.type);
      if (!bucket) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}` },
          { status: 400 }
        );
      }

      const maxBytes = ALLOWED_VIDEO_TYPES.includes(file.type) ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File too large (max ${maxBytes / 1024 / 1024}MB): ${file.name}` },
          { status: 400 }
        );
      }

      const ext = (file.name.split('.').pop() ?? 'webp').toLowerCase().replace(/[^a-z0-9]/g, '');
      const base = file.name
        .replace(/\.[^.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'file';
      const storagePath = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json(
          { error: `Upload failed for ${file.name}: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);

      paths.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({ paths });
  } catch (e) {
    console.error('upload failed:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
