import sharp from 'sharp';
import { exec } from './exec';
import { stat } from 'fs/promises';

export enum MediaType {
  Video = 'video',
  Image = 'image',
  Audio = 'audio',
  Unknown = 'unknown'
}

export interface MediaInfo {
  type: MediaType;
  duration?: number;
  width?: number;
  height?: number;
  size: number;
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];
const AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];

function getTypeFromExtension(filePath: string): MediaType {
  const ext = filePath.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
  if (IMAGE_EXTS.includes(ext)) return MediaType.Image;
  if (VIDEO_EXTS.includes(ext)) return MediaType.Video;
  if (AUDIO_EXTS.includes(ext)) return MediaType.Audio;
  return MediaType.Unknown;
}

export async function getMediaInfo(filePath: string): Promise<MediaInfo> {
  const type = getTypeFromExtension(filePath);
  const stats = await stat(filePath);

  if (type === MediaType.Image) {
    const metadata = await sharp(filePath).metadata();
    
    return {
      type: MediaType.Image,
      width: metadata.width,
      height: metadata.height,
      size: stats.size,
    };
  }

  const output = await exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`);
  const data = JSON.parse(output);

  const videoStream = data.streams?.find((s: any) => s.codec_type === 'video');

  return {
    type,
    duration: data.format?.duration ? parseFloat(data.format.duration) : undefined,
    width: videoStream?.width,
    height: videoStream?.height,
    size: stats.size,
  };
}
