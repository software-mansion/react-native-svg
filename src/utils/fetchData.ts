import { Platform } from 'react-native';

export function fetchText(uri?: string): Promise<string | null> {
  if (
    uri &&
    uri.startsWith('data:image/svg+xml;utf8') &&
    Platform.OS === 'android'
  ) {
    return new Promise((resolve) => {
      resolve(dataUriToXml(uri));
    });
  } else {
    return fetchUriData(uri);
  }
}

function dataUriToXml(uri: string): string | null {
  try {
    // decode and remove data:image/svg+xml;utf8, prefix
    const xml = decodeURIComponent(uri).split(',').slice(1).join(',');
    return xml;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

async function fetchUriData(uri?: string) {
  if (!uri) {
    return null;
  }
  const response = await fetch(uri);
  if (response.ok || (response.status === 0 && uri.startsWith('file://'))) {
    return await response.text();
  }
  throw new Error(`Fetching ${uri} failed with status ${response.status}`);
}
