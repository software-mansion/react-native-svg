import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { fetchText } from 'react-native-svg';
import { LocalSvg, WithLocalSvg } from '../src/css/LocalSvg';

jest.mock('react-native-svg', () => ({
  ...jest.requireActual('../src/ReactNativeSVG'),
  fetchText: jest.fn(),
}));

const mockedFetchText = fetchText as jest.MockedFunction<typeof fetchText>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function getRenderedWidth(tree: renderer.ReactTestRenderer) {
  return tree.root.findByType('RNSVGSvgView' as React.ElementType).props.bbWidth;
}

const firstAsset = { uri: 'first.svg' };
const secondAsset = { uri: 'second.svg' };
const firstSvg = '<svg width="111" height="1" />';
const secondSvg = '<svg width="222" height="1" />';

describe.each([
  ['LocalSvg', LocalSvg],
  ['WithLocalSvg', WithLocalSvg],
] as const)('%s', (_name, Component) => {
  beforeEach(() => {
    mockedFetchText.mockReset();
  });

  test('ignores a stale response after the asset changes', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    mockedFetchText
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<Component asset={firstAsset} />);
    });
    await act(async () => {
      tree.update(<Component asset={secondAsset} />);
    });
    await act(async () => {
      second.resolve(secondSvg);
      await second.promise;
    });
    await act(async () => {
      first.resolve(firstSvg);
      await first.promise;
    });

    expect(getRenderedWidth(tree)).toBe(222);
  });
});

describe('LocalSvg errors', () => {
  beforeEach(() => {
    mockedFetchText.mockReset();
  });

  test('handles a rejected asset load', async () => {
    const error = new Error('failed');
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockedFetchText.mockRejectedValueOnce(error);

    try {
      await act(async () => {
        renderer.create(<LocalSvg asset={firstAsset} />);
      });

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(error);
    } finally {
      consoleError.mockRestore();
    }
  });
});
