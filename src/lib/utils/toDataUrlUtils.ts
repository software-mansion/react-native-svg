export type DataUrlOptions = JpegOptions | PngOptions;

interface JpegOptions {
  format: 'jpeg';
  quality?: number;
  size?: Size;
}

interface PngOptions {
  format: 'png';
  size?: Size;
}

export interface Size {
  width: number;
  height: number;
}

export function validateOptions(options?: DataUrlOptions) {
  if (options && options?.format === 'jpeg') {
    if (!validateJpegQualityParameter(options)) {
      throw new Error('toDataURL: Invalid quality parameter for JPEG format.');
    }
  }
}

function validateJpegQualityParameter(options: JpegOptions): boolean {
  if (options.quality && (options.quality < 0 || options.quality > 1)) {
    return false;
  }
  return true;
}
