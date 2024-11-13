import warnOnce from 'warn-once';

export function pickNotNil(object: { [prop: string]: unknown }) {
  const result: { [prop: string]: unknown } = {};
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
    }
  }
  return result;
}

export const idPattern = /#([^)]+)\)?$/;

export const getRandomNumber = () =>
  Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const warnUnimplementedFilter = () => {
  warnOnce(
    true,
    `Some of the used filters are not yet supported on native platforms. Please check the USAGE.md for more info. Not implemented filters:\n`,
    JSON.stringify(
      [
        'FeComponentTransfer',
        'FeConvolveMatrix',
        'FeDiffuseLighting',
        'FeDisplacementMap',
        'FeFuncA',
        'FeFuncB',
        'FeFuncG',
        'FeFuncR',
        'FeImage',
        'FeMorphology',
        'FePointLight',
        'FeSpecularLighting',
        'FeSpotLight',
        'FeTile',
        'FeTurbulence',
      ],
      null,
      2
    )
  );
};
