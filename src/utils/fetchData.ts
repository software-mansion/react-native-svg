import { Buffer } from 'buffer';

export function fetchText(uri?: string): Promise<string | null> {
  if (uri && uri.startsWith('data:')) {
    return new Promise((resolve) => {
      resolve(dataUriToXml(uri));
    });
  } else {
    return localFetch(uri);
  }
}

// copy from https://www.npmjs.com/package/data-uri-to-buffer
function dataUriToXml(uri: string) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError(
      '`uri` does not appear to be a Data URI (must begin with "data:")'
    );
  }
  // strip newlines
  uri = uri.replace(/\r?\n/g, '');
  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(',');
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError('malformed data: URI');
  }
  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(';');
  let base64 = false;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === 'base64') {
      base64 = true;
    }
  }

  // get the encoded data portion and decode URI-encoded chars
  const data = unescape(uri.substring(firstComma + 1));
  if (!base64) {
    return data;
  }
  return Buffer.from(data).toString('base64');
}

async function localFetch(uri?: string) {
  if (!uri) {
    return null;
  }
  const response = await fetch(uri);
  if (response.ok || (response.status === 0 && uri.startsWith('file://'))) {
    return await response.text();
  }
  throw new Error(`Fetching ${uri} failed with status ${response.status}`);
}
