import { join, dirname } from 'path';
import sharp from 'sharp';

export async function resizeImage(
  imagePath: string,
  width?: number,
  height?: number,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg'
): Promise<string> {
  const outputPath = join(dirname(imagePath), `resized.${format === 'jpeg' ? 'jpg' : format}`);
  
  const image = sharp(imagePath).resize(width, height, { fit: 'inside' });
  
  if (format === 'jpeg') {
    await image.jpeg().toFile(outputPath);
  } else if (format === 'png') {
    await image.png().toFile(outputPath);
  } else if (format === 'webp') {
    await image.webp().toFile(outputPath);
  }
  
  return outputPath;
}
