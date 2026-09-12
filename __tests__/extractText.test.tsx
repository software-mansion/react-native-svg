import { extractFont } from '../src/lib/extract/extractText';

describe('extractFont font-family fallbacks', () => {
  it('keeps a single family unchanged after trimming quotes', () => {
    expect(extractFont({ fontFamily: 'Georgia' }).fontFamily).toBe('Georgia');
    expect(extractFont({ fontFamily: '"Times New Roman"' }).fontFamily).toBe(
      'Times New Roman'
    );
  });

  it('preserves the full CSS font-family fallback list', () => {
    expect(extractFont({ fontFamily: 'MissingFont, serif' }).fontFamily).toBe(
      'MissingFont, serif'
    );
  });

  it('strips quotes around each family in a fallback list', () => {
    expect(
      extractFont({ fontFamily: '"Times New Roman", Georgia, serif' })
        .fontFamily
    ).toBe('Times New Roman, Georgia, serif');
  });

  it('preserves fallbacks from a CSS font shorthand', () => {
    expect(
      extractFont({ font: 'bold 16px MissingFont, serif' }).fontFamily
    ).toBe('MissingFont, serif');
  });
});
