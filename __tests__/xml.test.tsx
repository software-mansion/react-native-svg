import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { SvgFromUri, SvgUri } from '../src/xml';
import { fetchText } from '../src/utils/fetchData';

jest.mock('../src/utils/fetchData', () => ({
  fetchText: jest.fn(),
}));

const mockedFetchText = fetchText as jest.MockedFunction<typeof fetchText>;

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

const firstSvg = '<svg width="111" height="1" />';
const secondSvg = '<svg width="222" height="1" />';

describe.each([
  ['SvgUri', SvgUri],
  ['SvgFromUri', SvgFromUri],
] as const)('%s', (_name, Component) => {
  beforeEach(() => {
    mockedFetchText.mockReset();
  });

  test('ignores a stale response after the uri changes', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    mockedFetchText
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<Component uri="first.svg" />);
    });
    await act(async () => {
      tree.update(<Component uri="second.svg" />);
    });
    await act(async () => {
      second.resolve(secondSvg);
      await second.promise;
    });

    expect(tree.root.findByType('RNSVGSvgView').props.bbWidth).toBe(222);

    await act(async () => {
      first.resolve(firstSvg);
      await first.promise;
    });

    expect(tree.root.findByType('RNSVGSvgView').props.bbWidth).toBe(222);
  });
});

describe('SvgUri callbacks', () => {
  beforeEach(() => {
    mockedFetchText.mockReset();
  });

  test('does not report a stale success after the uri changes', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const firstOnLoad = jest.fn();
    const secondOnLoad = jest.fn();
    mockedFetchText
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<SvgUri uri="first.svg" onLoad={firstOnLoad} />);
    });
    await act(async () => {
      tree.update(<SvgUri uri="second.svg" onLoad={secondOnLoad} />);
    });
    await act(async () => {
      second.resolve(secondSvg);
      await second.promise;
    });
    await act(async () => {
      first.resolve(firstSvg);
      await first.promise;
    });

    expect(firstOnLoad).not.toHaveBeenCalled();
    expect(secondOnLoad).toHaveBeenCalledTimes(1);
    expect(tree.root.findByType('RNSVGSvgView').props.bbWidth).toBe(222);
  });

  test('ignores a stale rejection after the newer uri succeeds', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const firstOnError = jest.fn();
    const secondOnError = jest.fn();
    mockedFetchText
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <SvgUri
          uri="first.svg"
          onError={firstOnError}
          fallback={<React.Fragment>failed</React.Fragment>}
        />
      );
    });
    await act(async () => {
      tree.update(
        <SvgUri
          uri="second.svg"
          onError={secondOnError}
          fallback={<React.Fragment>failed</React.Fragment>}
        />
      );
    });
    await act(async () => {
      second.resolve(secondSvg);
      await second.promise;
    });
    await act(async () => {
      first.reject(new Error('stale failure'));
      await first.promise.catch(() => undefined);
    });

    expect(firstOnError).not.toHaveBeenCalled();
    expect(secondOnError).not.toHaveBeenCalled();
    expect(tree.root.findByType('RNSVGSvgView').props.bbWidth).toBe(222);
  });
});
