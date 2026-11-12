import path from 'path';
import ts from 'typescript';

const positionedElements = {
  Image: 'ImageProps',
  Mask: 'MaskProps',
  Rect: 'RectProps',
  TSpan: 'TSpanProps',
  Text: 'TextProps',
  Use: 'UseProps',
} as const;

const sourceDirectory = path.join(__dirname, '..', 'src');
const elementFile = (element: string) =>
  path.join(sourceDirectory, 'elements', `${element}.tsx`);
const transformPropsFile = path.join(
  sourceDirectory,
  'lib',
  'extract',
  'types.ts'
);

const program = ts.createProgram({
  rootNames: [...Object.keys(positionedElements).map(elementFile)],
  options: { jsx: ts.JsxEmit.React, noEmit: true, skipLibCheck: true },
});
const checker = program.getTypeChecker();

// The JSDoc tags editors and lint rules read, which include the tags a member
// inherits from the member it overrides.
const readsAsDeprecated = (
  file: string,
  interfaceName: string,
  memberName: string
) => {
  const sourceFile = program.getSourceFile(file);
  const declaration = sourceFile?.statements.find(
    (statement): statement is ts.InterfaceDeclaration =>
      ts.isInterfaceDeclaration(statement) &&
      statement.name.text === interfaceName
  );
  const member = declaration?.members.find(
    (candidate) => candidate.name?.getText(sourceFile) === memberName
  );
  if (member?.name === undefined) {
    throw new Error(`${interfaceName}.${memberName} not found in ${file}`);
  }
  const symbol = checker.getSymbolAtLocation(member.name);
  return (
    symbol?.getJsDocTags(checker).some((tag) => tag.name === 'deprecated') ??
    false
  );
};

describe('position props', () => {
  it.each(Object.entries(positionedElements))(
    "%s's own x and y are not the deprecated transform shorthands",
    (element, interfaceName) => {
      expect(readsAsDeprecated(elementFile(element), interfaceName, 'x')).toBe(
        false
      );
      expect(readsAsDeprecated(elementFile(element), interfaceName, 'y')).toBe(
        false
      );
    }
  );

  it('keeps the x and y transform shorthands deprecated', () => {
    expect(readsAsDeprecated(transformPropsFile, 'TransformProps', 'x')).toBe(
      true
    );
    expect(readsAsDeprecated(transformPropsFile, 'TransformProps', 'y')).toBe(
      true
    );
  });
});
