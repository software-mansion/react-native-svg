import * as React from 'react';
import renderer from 'react-test-renderer';
import type { ReactTestRendererJSON } from 'react-test-renderer';
import type { ColorValue } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  SvgXml,
} from '../src';
import { SvgCss } from '../src/css';
import type extractGradient from '../src/lib/extract/extractGradient';
import type { NumberProp } from '../src/lib/extract/types';

// src/css imports the package by name, which tsconfig maps to ./src and jest would resolve to the built lib.
jest.mock('react-native-svg', () => jest.requireActual('../src'), {
  virtual: true,
});

type Platform = 'android' | 'ios';

type PlatformModules = {
  processColor: typeof import('react-native').processColor;
  extractGradient: typeof extractGradient;
};

// The jest preset binds processColor to iOS before a test runs, so Android's signed form needs its own registry.
const loadOn = (os: Platform): PlatformModules => {
  const loaded: { modules?: PlatformModules } = {};
  jest.isolateModules(() => {
    jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
      ...jest.requireActual('react-native/Libraries/Utilities/Platform'),
      OS: os,
    }));
    loaded.modules = {
      processColor:
        jest.requireActual<typeof import('react-native')>('react-native')
          .processColor,
      extractGradient: jest.requireActual<
        typeof import('../src/lib/extract/extractGradient')
      >('../src/lib/extract/extractGradient').default,
    };
  });
  const { modules } = loaded;
  if (modules === undefined) {
    throw new Error(`could not load the ${os} modules`);
  }
  return modules;
};

type StopInput = { stopColor?: ColorValue; stopOpacity?: NumberProp };

const packStopOn = (modules: PlatformModules, stop: StopInput): number => {
  const extracted = modules.extractGradient(
    { id: 'gradient', children: [<Stop key="stop" offset={0} {...stop} />] },
    null
  );
  return extracted?.gradient[1] ?? NaN;
};

const alphaOf = (packed: number) => packed >>> 24;
const rgbOf = (packed: number) => packed & 0x00ffffff;

// https://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty — stop-opacity times the alpha of stop-color
const OPAQUE_STOPS: [ColorValue, NumberProp | undefined, number][] = [
  ['#ff0000', undefined, 255],
  ['#00ff00', 0.5, 128],
  ['blue', '25%', 64],
  ['rgb(1, 2, 3)', 0, 0],
];

const TRANSLUCENT_STOPS: [ColorValue, NumberProp | undefined, number][] = [
  ['#0000000D', undefined, 13],
  ['#ff000080', 1, 128],
  ['#f008', 1, 136],
  ['rgba(255, 0, 0, 0.5)', 0.5, 64],
  ['rgba(14, 14, 14, 0.45)', 1, 115],
  ['hsla(120, 100%, 50%, 0.25)', 1, 64],
  ['transparent', 1, 0],
];

describe.each(['ios', 'android'] as const)(
  'the alpha a gradient stop is packed with on %s',
  (os) => {
    const modules = loadOn(os);

    test('processColor answers in the form this platform uses', () => {
      const processed = modules.processColor('rgba(255, 0, 0, 0.5)');
      expect(typeof processed === 'number' && processed < 0).toBe(
        os === 'android'
      );
    });

    test.each(OPAQUE_STOPS)(
      'an opaque %s at stop-opacity %s keeps alpha %s',
      (stopColor, stopOpacity, alpha) => {
        expect(alphaOf(packStopOn(modules, { stopColor, stopOpacity }))).toBe(
          alpha
        );
      }
    );

    test.each(TRANSLUCENT_STOPS)(
      'a translucent %s at stop-opacity %s is multiplied down to alpha %s',
      (stopColor, stopOpacity, alpha) => {
        expect(alphaOf(packStopOn(modules, { stopColor, stopOpacity }))).toBe(
          alpha
        );
      }
    );

    test('a stop with no stop-color is opaque black at its stop-opacity', () => {
      const packed = packStopOn(modules, { stopOpacity: 0.5 });
      expect([rgbOf(packed), alphaOf(packed)]).toEqual([0x000000, 128]);
    });

    test('keeps the red, green and blue channels of the stop color', () => {
      expect(
        rgbOf(packStopOn(modules, { stopColor: 'rgba(18, 52, 86, 0.5)' }))
      ).toBe(0x123456);
      expect(
        rgbOf(packStopOn(modules, { stopColor: '#12345680', stopOpacity: 0.2 }))
      ).toBe(0x123456);
    });
  }
);

test('every stop packs to the same value on Android and on iOS', () => {
  const android = loadOn('android');
  const ios = loadOn('ios');
  for (const [stopColor, stopOpacity] of [
    ...OPAQUE_STOPS,
    ...TRANSLUCENT_STOPS,
  ]) {
    const stop = { stopColor, stopOpacity };
    expect(packStopOn(android, stop)).toBe(packStopOn(ios, stop));
  }
});

const findHosts = (
  node: ReactTestRendererJSON | ReactTestRendererJSON[] | null,
  type: string
): ReactTestRendererJSON[] => {
  if (node === null) {
    return [];
  }
  if (Array.isArray(node)) {
    return node.flatMap((child) => findHosts(child, type));
  }
  const children = (node.children ?? []).filter(
    (child): child is ReactTestRendererJSON => typeof child !== 'string'
  );
  return [
    ...(node.type === type ? [node] : []),
    ...children.flatMap((child) => findHosts(child, type)),
  ];
};

const renderedStopAlphas = (element: React.ReactElement, host: string) =>
  findHosts(renderer.create(element).toJSON(), host).map((gradient) =>
    (gradient.props.gradient as number[])
      .filter((_value, index) => index % 2 === 1)
      .map(alphaOf)
  );

describe('every channel a stop color reaches a gradient through', () => {
  const translucent = 'rgba(255, 0, 0, 0.5)';

  test('Stop props on a LinearGradient and a RadialGradient', () => {
    const stops = [
      <Stop key="a" offset={0} stopColor={translucent} stopOpacity={0.5} />,
      <Stop key="b" offset={1} stopColor={translucent} />,
    ];
    const element = (
      <Svg>
        <Defs>
          <LinearGradient id="linear">{stops}</LinearGradient>
          <RadialGradient id="radial">{stops}</RadialGradient>
        </Defs>
      </Svg>
    );
    expect(renderedStopAlphas(element, 'RNSVGLinearGradient')).toEqual([
      [64, 128],
    ]);
    expect(renderedStopAlphas(element, 'RNSVGRadialGradient')).toEqual([
      [64, 128],
    ]);
  });

  test('stop-color and stop-opacity attributes in SvgXml', () => {
    const xml = `<svg xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="linear">
        <stop offset="0" stop-color="${translucent}" stop-opacity="0.5" />
        <stop offset="1" stop-color="#0000000D" />
      </linearGradient>
    </svg>`;
    expect(
      renderedStopAlphas(<SvgXml xml={xml} />, 'RNSVGLinearGradient')
    ).toEqual([[64, 13]]);
  });

  test('an inline style attribute in SvgXml', () => {
    const xml = `<svg xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="linear">
        <stop offset="0" style="stop-color: ${translucent}; stop-opacity: 0.5" />
      </linearGradient>
    </svg>`;
    expect(
      renderedStopAlphas(<SvgXml xml={xml} />, 'RNSVGLinearGradient')
    ).toEqual([[64]]);
  });

  test('a stop-color rule in an SvgCss style sheet', () => {
    const xml = `<svg xmlns="http://www.w3.org/2000/svg">
      <style>
        .from { stop-color: rgba(255, 255, 255, 1); }
        .to { stop-color: rgba(255, 255, 255, 0.6); }
      </style>
      <linearGradient id="linear">
        <stop class="from" offset="0" />
        <stop class="to" offset="1" />
      </linearGradient>
    </svg>`;
    expect(
      renderedStopAlphas(<SvgCss xml={xml} />, 'RNSVGLinearGradient')
    ).toEqual([[255, 153]]);
  });
});
