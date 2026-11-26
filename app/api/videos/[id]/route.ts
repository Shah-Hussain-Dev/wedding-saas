import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getVideoById } from '@/data/video-invitations';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const videoItem = getVideoById(id);

  if (!videoItem) {
    return new NextResponse('Video Not Found', { status: 404 });
  }

  // Prevent directory traversal by strictly using the predefined filename
  const filePath = path.join(process.cwd(), 'videos', videoItem.filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Video File Missing On Server', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    // Parse Range header, e.g. "bytes=0-1048575"
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (isNaN(start) || start >= fileSize || (parts[1] && end >= fileSize) || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${fileSize}`,
        },
      });
    }

    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    // Stream through Web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new NextResponse(readable as any, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } else {
    // Return full stream
    const fileStream = fs.createReadStream(filePath);
    const readable = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new NextResponse(readable as any, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }
}
