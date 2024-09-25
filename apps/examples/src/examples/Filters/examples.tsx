import {Example} from '../../examples';
import * as FeColorMatrix from './FeColorMatrix';
import * as FeGaussianBlur from './FeGaussianBlur';
import * as FeMerge from './FeMerge';
import * as FeOffset from './FeOffset';
import * as ReanimatedFeColorMatrix from './ReanimatedFeColorMatrix';
export {
  FeColorMatrix,
  FeGaussianBlur,
  FeMerge,
  FeOffset,
  ReanimatedFeColorMatrix,
};

export const EXAMPLES: Record<string, Example> = {
  FeColorMatrixExample: {
    icon: FeColorMatrix.icon,
    title: 'FeColorMatrix',
    samples: FeColorMatrix.samples,
  },
  FeGaussianBlurExample: {
    icon: FeGaussianBlur.icon,
    title: 'FeGaussianBlur',
    samples: FeGaussianBlur.samples,
  },
  FeMergeExample: {
    icon: FeMerge.icon,
    title: 'FeMerge',
    samples: FeMerge.samples,
  },
  FeOffsetExample: {
    icon: FeOffset.icon,
    title: 'FeOffset',
    samples: FeOffset.samples,
  },
  ReanimatedFeColorMatrixExample: {
    icon: ReanimatedFeColorMatrix.icon,
    title: 'ReanimatedFeColorMatrix',
    samples: ReanimatedFeColorMatrix.samples,
  },
};
