import fs from 'fs';
import path from 'path';

const podspec = fs.readFileSync(
  path.join(__dirname, '..', 'RNSVG.podspec'),
  'utf8'
);

describe('RNSVG.podspec platforms', () => {
  it('declares iOS and tvOS 15.1+ so Xcode 27 can build RNSVGFilters', () => {
    const ios = podspec.match(/:ios\s*=>\s*"(\d+\.\d+)"/);
    const tvos = podspec.match(/:tvos\s*=>\s*"(\d+\.\d+)"/);

    expect(ios).not.toBeNull();
    expect(tvos).not.toBeNull();
    expect(Number(ios![1])).toBeGreaterThanOrEqual(15.1);
    expect(Number(tvos![1])).toBeGreaterThanOrEqual(15.1);
  });
});
