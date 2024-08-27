import { Platform } from 'react-native';

export async function fetchText(uri?: string): Promise<string | null> {
  if (!uri) {
    return null;
  }
  if (uri.startsWith('data:image/svg+xml;utf8') && Platform.OS === 'android') {
    return dataUriToXml(uri);
  } else {
    return fetchUriData(uri);
  }
}

function dataUriToXml(uri: string): string | null {
  try {
    // decode and remove data:image/svg+xml;utf8, prefix
    return decodeURIComponent(uri).split(',').slice(1).join(',');
  } catch (error) {
    throw new Error(`Decoding ${uri} failed with error: ${error}`);
  }
}

async function fetchUriData(uri: string) {
  const response = await fetch(uri);
  if (response.ok || (response.status === 0 && uri.startsWith('file://'))) {
    return await response.text();
  }
  throw new Error(`Fetching ${uri} failed with status ${response.status}`);
}
