import { Image } from 'react-native';

import { resolveAssetUri } from '../src/lib/resolveAssetUri';
import { resolveAssetUri as resolveAssetUriWeb } from '../src/lib/resolveAssetUri.web';

jest.mock('@react-native/assets-registry/registry', () => ({
  getAssetByID: jest.fn(),
}));

const { getAssetByID: mockedGetAssetByID } = jest.requireMock(
  '@react-native/assets-registry/registry'
) as { getAssetByID: jest.Mock };

describe('resolveAssetUri', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockedGetAssetByID.mockReset();
  });

  it('uses the public Image resolver for numeric native assets', () => {
    const asset = {
      uri: 'http://localhost:8081/assets/icon@2x.svg',
      width: 24,
      height: 24,
      scale: 2,
    };
    const resolveAssetSource = jest
      .spyOn(Image, 'resolveAssetSource')
      .mockReturnValue(asset);

    expect(resolveAssetUri(7)).toEqual(asset);
    expect(resolveAssetSource).toHaveBeenCalledWith(7);
  });

  it('throws when the public Image resolver cannot find a native asset', () => {
    const resolveAssetSource = jest
      .spyOn(Image, 'resolveAssetSource')
      .mockReturnValue(null as never);

    expect(() => resolveAssetUri(404)).toThrow(
      'Image: asset with ID "404" could not be found.'
    );
    expect(resolveAssetSource).toHaveBeenCalledWith(404);
  });

  it('keeps using the web asset registry for numeric web assets', () => {
    mockedGetAssetByID.mockReturnValue({
      __packager_asset: true,
      fileSystemLocation: '/app/assets',
      httpServerLocation: '/assets',
      width: 24,
      height: 24,
      scales: [1],
      hash: 'hash',
      name: 'icon',
      type: 'svg',
    });

    expect(resolveAssetUriWeb(3)).toEqual({
      uri: '/assets/icon.svg',
      width: 24,
      height: 24,
      scale: 1,
    });
    expect(mockedGetAssetByID).toHaveBeenCalledWith(3);
  });

  it('throws when the web asset registry cannot find an asset', () => {
    mockedGetAssetByID.mockReturnValue(null);

    expect(() => resolveAssetUriWeb(404)).toThrow(
      'Image: asset with ID "404" could not be found.'
    );
    expect(mockedGetAssetByID).toHaveBeenCalledWith(404);
  });

  it.each([resolveAssetUri, resolveAssetUriWeb])(
    'keeps string, object and inline SVG URI behavior unchanged',
    (resolve) => {
      expect(resolve('https://example.com/icon.svg')).toEqual({
        uri: 'https://example.com/icon.svg',
      });
      expect(resolve({ uri: 'file:///tmp/icon.svg' })).toEqual({
        uri: 'file:///tmp/icon.svg',
      });
      expect(resolve('data:image/svg+xml;utf8,<svg fill="#fff" />')).toEqual({
        uri: 'data:image/svg+xml;utf8,%3Csvg%20fill%3D%22%23fff%22%20%2F%3E',
      });
    }
  );
});
