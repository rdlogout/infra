import { Hono } from 'hono';
import { downloadFile, cleanup } from '../lib/download';
import { getMediaInfo, MediaType } from '../lib/media-info';
import { extractThumbnail } from '../lib/thumbnail';
import { resizeImage } from '../lib/resize';

export const processRoute = new Hono();

processRoute.get('/', async (c) => {
  const url = c.req.query('url');
  const width = c.req.query('width') ? parseInt(c.req.query('width')!) : undefined;
  const height = c.req.query('height') ? parseInt(c.req.query('height')!) : undefined;
  const mode = c.req.query('mode');

  if (!url) {
    return c.json({ error: 'URL parameter is required' }, 400);
  }

  let tempDir: string | null = null;

  try {
    const { filePath, tempDir: dir } = await downloadFile(url);
    tempDir = dir;
    
    const info = await getMediaInfo(filePath);
    c.header('X-Info', JSON.stringify(info));

    if (mode === 'info') {
      await cleanup(tempDir);
      return c.body(null);
    }

    let processedPath = filePath;

    if (info.type === MediaType.Video) {
      processedPath = await extractThumbnail(filePath, width, height);
    } else if (info.type === MediaType.Image && (width || height)) {
      processedPath = await resizeImage(filePath, width, height);
    }

    const file = Bun.file(processedPath);
    const buffer = await file.arrayBuffer();
    
    await cleanup(tempDir);
    
    return new Response(buffer, {
      headers: { 'Content-Type': file.type }
    });
  } catch (error) {
    if (tempDir) await cleanup(tempDir);
    return c.json({ error: (error as Error).message }, 500);
  }
});
