import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { SvgCssUri, SvgWithCssUri } from '../src/css/css';
import { fetchText } from 'react-native-svg';

jest.mock('react-native-svg', () => ({
  ...jest.requireActual('../src/ReactNativeSVG'),
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

function getRenderedWidth(tree: renderer.ReactTestRenderer) {
  return tree.root.findByType('RNSVGSvgView' as React.ElementType).props.bbWidth;
}

describe.each([
  ['SvgCssUri', SvgCssUri],
  ['SvgWithCssUri', SvgWithCssUri],
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
    await act(async () => {
      first.resolve(firstSvg);
      await first.promise;
    });

    expect(getRenderedWidth(tree)).toBe(222);
  });
});

describe('SvgCssUri error recovery', () => {
  beforeEach(() => {
    mockedFetchText.mockReset();
  });

  test('renders a successful uri after a prior request failed', async () => {
    mockedFetchText
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce(secondSvg);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <SvgCssUri
          uri="first.svg"
          onError={jest.fn()}
          fallback={<React.Fragment>failed</React.Fragment>}
        />
      );
    });
    await act(async () => {
      tree.update(
        <SvgCssUri
          uri="second.svg"
          onError={jest.fn()}
          fallback={<React.Fragment>failed</React.Fragment>}
        />
      );
    });

    expect(getRenderedWidth(tree)).toBe(222);
  });

  test('uses the latest load callback without refetching the same uri', async () => {
    const request = deferred<string>();
    const firstOnLoad = jest.fn();
    const secondOnLoad = jest.fn();
    mockedFetchText.mockReturnValueOnce(request.promise);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <SvgCssUri uri="image.svg" onLoad={firstOnLoad} />
      );
    });
    await act(async () => {
      tree.update(<SvgCssUri uri="image.svg" onLoad={secondOnLoad} />);
    });
    await act(async () => {
      request.resolve(secondSvg);
      await request.promise;
    });

    expect(mockedFetchText).toHaveBeenCalledTimes(1);
    expect(firstOnLoad).not.toHaveBeenCalled();
    expect(secondOnLoad).toHaveBeenCalledTimes(1);
  });

  test('uses the latest error callback without refetching the same uri', async () => {
    const request = deferred<string>();
    const firstOnError = jest.fn();
    const secondOnError = jest.fn();
    mockedFetchText.mockReturnValueOnce(request.promise);

    let tree!: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <SvgCssUri uri="image.svg" onError={firstOnError} />
      );
    });
    await act(async () => {
      tree.update(<SvgCssUri uri="image.svg" onError={secondOnError} />);
    });
    await act(async () => {
      request.reject(new Error('failed'));
      await request.promise.catch(() => undefined);
    });

    expect(mockedFetchText).toHaveBeenCalledTimes(1);
    expect(firstOnError).not.toHaveBeenCalled();
    expect(secondOnError).toHaveBeenCalledTimes(1);
  });
});

describe.each([
  ['SvgCssUri', SvgCssUri],
  ['SvgWithCssUri', SvgWithCssUri],
] as const)('%s callbacks', (_name, Component) => {
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
      tree = renderer.create(<Component uri="first.svg" onLoad={firstOnLoad} />);
    });
    await act(async () => {
      tree.update(<Component uri="second.svg" onLoad={secondOnLoad} />);
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
    expect(getRenderedWidth(tree)).toBe(222);
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
        <Component
          uri="first.svg"
          onError={firstOnError}
          fallback={<React.Fragment>failed</React.Fragment>}
        />
      );
    });
    await act(async () => {
      tree.update(
        <Component
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
    expect(getRenderedWidth(tree)).toBe(222);
  });
});
