import { join } from 'path';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';

export async function downloadFile(url: string): Promise<{ filePath: string; tempDir: string }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

  const tempDir = await mkdtemp(join(tmpdir(), 'media-'));
  const ext = url.split('.').pop()?.split('?')[0] || 'bin';
  const filePath = join(tempDir, `file.${ext}`);

  const buffer = await response.arrayBuffer();
  await Bun.write(filePath, buffer);

  return { filePath, tempDir };
}

export async function cleanup(tempDir: string): Promise<void> {
  try {
    await rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}
