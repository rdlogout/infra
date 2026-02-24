import { join, dirname } from 'path';
import sharp from 'sharp';

export async function resizeImage(
  imagePath: string,
  width?: number,
  height?: number
): Promise<string> {
  const outputPath = join(dirname(imagePath), 'resized.jpg');
  
  await sharp(imagePath)
    .resize(width, height, { fit: 'inside' })
    .jpeg()
    .toFile(outputPath);
  
  return outputPath;
}
