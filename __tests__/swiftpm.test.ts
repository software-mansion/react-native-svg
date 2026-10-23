// Guards Package.swift and its packaging. React Native's SwiftPM autolinker
// (>= 0.88) consumes the manifest as-is: it references the product by
// package.json's swiftpmConfig.name, resolves the React Native packages by
// relative path, and leaves a manifest a library ships itself alone. Drift in any of those makes
// an app fail to resolve, compile or link.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(REPO_ROOT, 'Package.swift');

type Dependency = {
  nameForTargetDependencyResolutionOnly?: string;
  path?: string;
  fileSystem?: Dependency[];
};

type Target = {
  name: string;
  path: string;
  sources: string[];
  exclude: string[];
  publicHeadersPath: string | null;
  dependencies: { product?: unknown[] }[];
  settings: {
    tool: string;
    kind: Record<string, { _0: unknown }>;
    condition?: { config?: string };
  }[];
};

type Dump = {
  cxxLanguageStandard: string | null;
  platforms: { platformName: string; version: string }[];
  products: { name: string; targets: string[]; type: { library?: string[] } }[];
  dependencies: Dependency[];
  targets: Target[];
};

function contract(dump: Dump) {
  return {
    cxxLanguageStandard: dump.cxxLanguageStandard,
    platforms: dump.platforms.map((each) => [each.platformName, each.version]),
    products: dump.products.map((product) => ({
      name: product.name,
      targets: product.targets,
      library: product.type.library,
    })),
    dependencies: dump.dependencies
      .flatMap((dependency) => dependency.fileSystem ?? [dependency])
      .map((each) => [each.nameForTargetDependencyResolutionOnly, each.path]),
    targets: dump.targets.map((target) => ({
      name: target.name,
      path: target.path,
      sources: target.sources,
      publicHeadersPath: target.publicHeadersPath,
      products: target.dependencies.map((each) => each.product?.slice(0, 2)),
      settings: target.settings.flatMap((setting) =>
        Object.entries(setting.kind).map(([kind, value]) =>
          [setting.tool, kind, value._0, setting.condition?.config].filter(
            (part) => part !== undefined
          )
        )
      ),
    })),
  };
}

function filesUnder(relative: string): string[] {
  const absolute = path.join(REPO_ROOT, relative);
  if (!fs.statSync(absolute).isDirectory()) {
    return [relative];
  }
  return fs
    .readdirSync(absolute)
    .filter((name) => !name.startsWith('.'))
    .flatMap((name) => filesUnder(path.join(relative, name)));
}

const HEADER_SEARCH_PATHS = [
  'common/cpp',
  'common/cpp/react/renderer/components',
  'apple',
  'apple/Brushes',
  'apple/Elements',
  'apple/Filters',
  'apple/Filters/MetalCI',
  'apple/Shapes',
  'apple/Text',
  'apple/Utils',
];

const DEFINES = [
  'RCT_NEW_ARCH_ENABLED=1',
  'REACT_NATIVE_MINOR_VERSION=88',
];

let hasSwift = process.platform === 'darwin';
try {
  if (hasSwift) {
    execFileSync('xcrun', ['--find', 'swift'], { stdio: 'ignore' });
  }
} catch {
  hasSwift = false;
}

describe('Package.swift', () => {
  it('is a hand-written manifest for Swift 6 tools or later', () => {
    const source = fs.readFileSync(MANIFEST, 'utf8');
    const [, major] =
      /^\/\/ swift-tools-version:\s*(\d+)\.\d+/.exec(source) ?? [];
    expect(Number(major)).toBeGreaterThanOrEqual(6);
    expect(source).not.toMatch(/AUTO-(SCAFFOLDED|GENERATED)/);
  });
});

(hasSwift ? describe : describe.skip)(
  'Package.swift evaluated by SwiftPM',
  () => {
    let scratchPath: string;
    let dump: Dump;

    beforeAll(() => {
      scratchPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rnsvg-spm-'));
      dump = JSON.parse(
        execFileSync(
          'swift',
          ['package', '--scratch-path', scratchPath, 'dump-package'],
          { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }
        )
      ) as Dump;
    }, 300_000);

    afterAll(() => {
      if (scratchPath) {
        fs.rmSync(scratchPath, { force: true, recursive: true });
      }
    });

    it('matches the React Native autolinking contract', () => {
      expect(contract(dump)).toEqual({
        cxxLanguageStandard: 'c++20',
        platforms: [['ios', '15.1']],
        products: [
          { name: 'RNSVG', targets: ['RNSVG'], library: ['automatic'] },
        ],
        dependencies: [
          ['ReactNative', path.resolve(REPO_ROOT, '../../../../xcframeworks')],
          ['React-GeneratedCode', path.resolve(REPO_ROOT, '../../../ios')],
        ],
        targets: [
          {
            name: 'RNSVG',
            path: '.',
            sources: ['apple', 'common/cpp'],
            publicHeadersPath: 'apple',
            products: [
              ['ReactHeaders', 'ReactNative'],
              ['ReactNativeHeaders', 'ReactNative'],
              ['ReactNativeDependenciesHeaders', 'ReactNative'],
              ['ReactAppHeaders', 'React-GeneratedCode'],
            ],
            settings: [
              ...DEFINES.map((define) => ['c', 'define', define]),
              ...HEADER_SEARCH_PATHS.map((dir) => [
                'c',
                'headerSearchPath',
                dir,
              ]),
              ...DEFINES.map((define) => ['cxx', 'define', define]),
              ...HEADER_SEARCH_PATHS.map((dir) => [
                'cxx',
                'headerSearchPath',
                dir,
              ]),
              ['cxx', 'define', 'DEBUG', 'debug'],
              ['cxx', 'define', 'NDEBUG', 'release'],
              ['linker', 'linkedFramework', 'UIKit'],
              ['linker', 'linkedFramework', 'Foundation'],
              ['linker', 'linkedFramework', 'CoreGraphics'],
            ],
          },
        ],
      });
    });

    // SwiftPM rejects unsafe flags in any package that is not a root or a
    // local dependency, which would rule out ever serving this one remotely.
    it('passes no unsafe flags', () => {
      const kinds = dump.targets.flatMap((target) =>
        target.settings.flatMap((setting) => Object.keys(setting.kind))
      );
      expect(kinds).not.toContain('unsafeFlags');
    });

    it('compiles what the podspec compiles for iOS', () => {
      const [target] = dump.targets;
      const excluded = (file: string) =>
        target.exclude.some(
          (entry) => file === entry || file.startsWith(`${entry}/`)
        );
      const compiled = target.sources
        .flatMap(filesUnder)
        .filter((file) => !excluded(file));

      const podspecIOS = [
        ...filesUnder('apple').filter(
          (file) => /\.(h|m|mm)$/.test(file) && !/\.macos\.(h|m|mm)$/.test(file)
        ),
        ...filesUnder('common/cpp').filter((file) => /\.(cpp|h)$/.test(file)),
      ];

      expect(compiled.sort()).toEqual(podspecIOS.sort());
    });

    it('references only paths that exist', () => {
      const referenced = dump.targets.flatMap((target) =>
        [...target.sources, ...target.exclude].map((entry) =>
          path.join(REPO_ROOT, target.path, entry)
        )
      );
      expect(referenced.filter((entry) => !fs.existsSync(entry))).toEqual([]);
    });
  }
);

describe('npm package', () => {
  it('ships the manifest but no local SwiftPM state', () => {
    // npm 10 runs `prepare` despite --ignore-scripts; keeping scripts in the
    // background keeps their output out of the JSON on stdout.
    const packed = execFileSync(
      'npm',
      [
        'pack',
        '--dry-run',
        '--json',
        '--ignore-scripts',
        '--foreground-scripts=false',
      ],
      { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }
    );
    const [tarball] = JSON.parse(packed) as { files: { path: string }[] }[];
    const files = tarball?.files.map((file) => file.path) ?? [];

    expect(files).toEqual(
      expect.arrayContaining(['Package.swift', 'RNSVG.podspec'])
    );
    expect(
      files.filter(
        (file) => file === 'Package.resolved' || file.startsWith('.build/')
      )
    ).toEqual([]);
  }, 300_000);
});
