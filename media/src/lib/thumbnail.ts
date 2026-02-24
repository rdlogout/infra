import { join, dirname } from 'path';
import { exec } from './exec';

export async function extractThumbnail(
  videoPath: string,
  width?: number,
  height?: number,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg'
): Promise<string> {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const outputPath = join(dirname(videoPath), `thumbnail.${ext}`);
  const scale = (width || height) ? `-vf "scale=${width || -1}:${height || -1}"` : '';
  
  await exec(`ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 ${scale} "${outputPath}"`);
  
  return outputPath;
}
